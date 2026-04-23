import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useFindEmotionDispatch, useFindEmotionState } from '@/state/context'
import type { HistoryEntry, Screen } from '@/state/types'
import {
  INITIAL_PAGE_ID,
  isRegisteredPageId,
  pageRegistry,
  type PageId,
} from './pageRegistry'

/** Key on `history.state` holding `PageId[]` for browser back/forward sync. */
export const HISTORY_STACK_KEY = 'appStack' as const

/**
 * Key on `history.state` holding {@link HistoryEntry}[] in lockstep with
 * `appStack` (length = `appStack.length - 1` when the root is a single home page).
 */
export const SESSION_HISTORY_KEY = 'sessionHistory' as const

export type Direction = 1 | -1

function sanitizeStack(raw: unknown): PageId[] {
  if (!Array.isArray(raw)) return [INITIAL_PAGE_ID]
  const ids = raw.filter(
    (x): x is PageId => typeof x === 'string' && isRegisteredPageId(x),
  )
  if (ids.length === 0) return [INITIAL_PAGE_ID]
  return ids
}

function mergeHistoryState(patch: Record<string, unknown>): Record<string, unknown> {
  const cur = window.history.state
  if (cur && typeof cur === 'object' && !Array.isArray(cur)) {
    return { ...(cur as Record<string, unknown>), ...patch }
  }
  return patch
}

function readStackFromHistory(): PageId[] | undefined {
  const s = window.history.state
  if (!s || typeof s !== 'object' || Array.isArray(s)) return undefined
  const raw = (s as Record<string, unknown>)[HISTORY_STACK_KEY]
  return raw !== undefined ? sanitizeStack(raw) : undefined
}

function inferSessionFromStack(stack: PageId[]): HistoryEntry[] {
  if (stack.length <= 1) return []
  return stack.slice(1).map((screen) => ({
    passIndex: 0,
    screen: screen as Screen,
  }))
}

/**
 * `sessionHistory` is one entry per step past the first page; align length with
 * `stack` and validate entries; for legacy or corrupt state, best-effort infer.
 */
function sanitizeSessionHistory(raw: unknown, stack: PageId[]): HistoryEntry[] {
  const need = Math.max(0, stack.length - 1)
  if (need === 0) return []
  if (!Array.isArray(raw)) {
    return inferSessionFromStack(stack)
  }
  const out: HistoryEntry[] = []
  for (let i = 0; i < need; i++) {
    const item = raw[i]
    if (!item || typeof item !== 'object' || !('passIndex' in item) || !('screen' in item)) {
      return inferSessionFromStack(stack)
    }
    const passIndex = Number((item as { passIndex: unknown }).passIndex)
    const screen = (item as { screen: unknown }).screen
    if (
      !Number.isInteger(passIndex) ||
      typeof screen !== 'string' ||
      !isRegisteredPageId(screen)
    ) {
      return inferSessionFromStack(stack)
    }
    out.push({ passIndex, screen: screen as Screen })
  }
  return out
}

function buildSessionTraceFromState(state: unknown, stack: PageId[]): HistoryEntry[] {
  if (state && typeof state === 'object' && !Array.isArray(state)) {
    const raw = (state as Record<string, unknown>)[SESSION_HISTORY_KEY]
    return sanitizeSessionHistory(raw, stack)
  }
  return inferSessionFromStack(stack)
}

export type PushPageOptions = {
  /**
   * When the `passIndex` for the new history row is not the current `activePass`
   * in this render (e.g. `add_pass` then `pushPage` in the same handler), pass the
   * index that should be stored in `sessionHistory`.
   */
  passIndex?: number
}

type PageStackContextValue = {
  currentPageId: PageId
  /** Stable key for the visible stack path (depth + route). */
  stackKey: string
  canGoBack: boolean
  /** Last navigation direction: used by the shell for slide axis (1 forward, -1 back). */
  navigationDirection: Direction
  pushPage: (id: PageId, options?: PushPageOptions) => void
  popPage: () => void
  /**
   * Clear the in-app stack to a single “root” page and sync the browser history so
   * back/forward no longer re-enter the previous flow. Use after session reset
   * (e.g. “Start over”).
   */
  resetPageStackToRoot: () => void
}

const PageStackContext = createContext<PageStackContextValue | null>(null)

const slideTransition = { type: 'tween' as const, duration: 0.35, ease: 'easeInOut' as const }

const slideVariants = {
  enter: (direction: Direction) => ({
    x: direction >= 0 ? '100%' : '-100%',
  }),
  center: { x: 0 },
  exit: (direction: Direction) => ({
    x: direction >= 0 ? '-100%' : '100%',
  }),
}

const pageMetaTitleById: Record<PageId, string> = {
  welcome: 'Find the Emotion',
  intro: 'Find the Emotion · How this works',
  'my-state': 'Find the Emotion · What feels closest right now?',
  'my-emotions': 'Find the Emotion · What feels true for you right now?',
  'refined-emotions': 'Find the Emotion · Which feels the strongest?',
  'strongest-emotion': 'Find the Emotion · Your strongest feeling right now',
  pause: 'Find the Emotion · Pause for a moment',
  summary: 'Find the Emotion · What feels strongest right now is',
}

/**
 * Must render inside `FindEmotionProvider` so pushes can store `passIndex` in
 * `sessionHistory` next to `appStack` on the same `history.state` object.
 */
export function PageStackProvider({ children }: { children: ReactNode }) {
  const { activePass } = useFindEmotionState()
  const dispatch = useFindEmotionDispatch()
  const [stack, setStack] = useState<PageId[]>([INITIAL_PAGE_ID])
  const [direction, setDirection] = useState<Direction>(1)
  const stackRef = useRef(stack)
  stackRef.current = stack
  const pendingPruneAfterGoBackRef = useRef(false)
  const pruneFallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentPageId = stack[stack.length - 1] ?? INITIAL_PAGE_ID

  useLayoutEffect(() => {
    const fromHistory = readStackFromHistory()
    if (fromHistory) {
      setStack(fromHistory)
      const trace = buildSessionTraceFromState(window.history.state, fromHistory)
      dispatch({ type: 'set_session_trace', history: trace })
      return
    }
    const initial = [INITIAL_PAGE_ID] as const
    window.history.replaceState(
      mergeHistoryState({
        [HISTORY_STACK_KEY]: initial,
        [SESSION_HISTORY_KEY]: [] satisfies HistoryEntry[],
      }),
      '',
      window.location.href,
    )
    dispatch({ type: 'set_session_trace', history: [] })
  }, [dispatch])

  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      const raw =
        e.state && typeof e.state === 'object' && !Array.isArray(e.state)
          ? (e.state as Record<string, unknown>)[HISTORY_STACK_KEY]
          : undefined
      const next = sanitizeStack(raw)
      const prevLen = stackRef.current.length
      setDirection(next.length < prevLen ? -1 : 1)
      setStack(next)
      stackRef.current = next
      const trace = buildSessionTraceFromState(e.state, next)
      dispatch({ type: 'set_session_trace', history: trace })
      if (pendingPruneAfterGoBackRef.current) {
        if (pruneFallbackTimerRef.current) {
          clearTimeout(pruneFallbackTimerRef.current)
          pruneFallbackTimerRef.current = null
        }
        pendingPruneAfterGoBackRef.current = false
        const base: PageId[] = [INITIAL_PAGE_ID]
        window.history.pushState(
          mergeHistoryState({
            [HISTORY_STACK_KEY]: base,
            [SESSION_HISTORY_KEY]: [] satisfies HistoryEntry[],
          }),
          '',
          window.location.href,
        )
        stackRef.current = base
        setStack(base)
        setDirection(1)
        dispatch({ type: 'set_session_trace', history: [] })
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => {
      if (pruneFallbackTimerRef.current) clearTimeout(pruneFallbackTimerRef.current)
      window.removeEventListener('popstate', onPopState)
    }
  }, [dispatch])

  useEffect(() => {
    document.title = pageMetaTitleById[currentPageId]
  }, [currentPageId])

  const pushPage = useCallback(
    (id: PageId, options?: PushPageOptions) => {
      if (!isRegisteredPageId(id)) return
      const passIndexForNewEntry = options?.passIndex ?? activePass
      const cur = stackRef.current
      const prevSession = buildSessionTraceFromState(window.history.state, cur)
      const next = [...cur, id]
      const nextSession: HistoryEntry[] = [
        ...prevSession,
        { passIndex: passIndexForNewEntry, screen: id as Screen },
      ]
      setDirection(1)
      window.history.pushState(
        mergeHistoryState({
          [HISTORY_STACK_KEY]: next,
          [SESSION_HISTORY_KEY]: nextSession,
        }),
        '',
        window.location.href,
      )
      stackRef.current = next
      setStack(next)
      dispatch({ type: 'set_session_trace', history: nextSession })
    },
    [activePass, dispatch],
  )

  const popPage = useCallback(() => {
    if (stackRef.current.length <= 1) return
    window.history.back()
  }, [])

  const resetPageStackToRoot = useCallback(() => {
    const target = INITIAL_PAGE_ID
    const s = stackRef.current
    if (s.length <= 1) {
      if (s[0] === target) {
        window.history.replaceState(
          mergeHistoryState({
            [HISTORY_STACK_KEY]: [target],
            [SESSION_HISTORY_KEY]: [] satisfies HistoryEntry[],
          }),
          '',
          window.location.href,
        )
        dispatch({ type: 'set_session_trace', history: [] })
        return
      }
      window.history.replaceState(
        mergeHistoryState({
          [HISTORY_STACK_KEY]: [target],
          [SESSION_HISTORY_KEY]: [] satisfies HistoryEntry[],
        }),
        '',
        window.location.href,
      )
      setDirection(1)
      stackRef.current = [target]
      setStack([target])
      dispatch({ type: 'set_session_trace', history: [] })
      return
    }
    const back = s.length - 1
    pendingPruneAfterGoBackRef.current = true
    if (pruneFallbackTimerRef.current) clearTimeout(pruneFallbackTimerRef.current)
    pruneFallbackTimerRef.current = setTimeout(() => {
      pruneFallbackTimerRef.current = null
      pendingPruneAfterGoBackRef.current = false
    }, 400)
    window.history.go(-back)
  }, [dispatch])

  const value = useMemo<PageStackContextValue>(() => {
    return {
      currentPageId,
      stackKey: stack.join('/'),
      canGoBack: stack.length > 1,
      navigationDirection: direction,
      pushPage,
      popPage,
      resetPageStackToRoot,
    }
  }, [currentPageId, stack, direction, pushPage, popPage, resetPageStackToRoot])

  return (
    <PageStackContext.Provider value={value}>{children}</PageStackContext.Provider>
  )
}

/** Renders the animated page layer; place inside a flex main with min-h-0. Background stays transparent. */
export function PageStackOutlet() {
  const { currentPageId, stackKey, navigationDirection } = usePageStack()
  const Page = pageRegistry[currentPageId]

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden">
      <AnimatePresence initial={false} custom={navigationDirection}>
        <motion.div
          key={stackKey}
          role="presentation"
          custom={navigationDirection}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={slideTransition}
          className="absolute inset-0 flex min-h-0 flex-col bg-transparent"
        >
          <div className="min-h-0 flex-1 overflow-y-auto">
            <Page />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export function usePageStack(): PageStackContextValue {
  const ctx = useContext(PageStackContext)
  if (!ctx) {
    throw new Error('usePageStack must be used within PageStackProvider')
  }
  return ctx
}
