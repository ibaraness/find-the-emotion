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
import {
  INITIAL_PAGE_ID,
  isRegisteredPageId,
  pageRegistry,
  type PageId,
} from './pageRegistry'

/** Key on `history.state` holding `PageId[]` for browser back/forward sync. */
export const HISTORY_STACK_KEY = 'appStack' as const

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

type PageStackContextValue = {
  currentPageId: PageId
  /** Stable key for the visible stack path (depth + route). */
  stackKey: string
  canGoBack: boolean
  /** Last navigation direction: used by the shell for slide axis (1 forward, -1 back). */
  navigationDirection: Direction
  pushPage: (id: PageId) => void
  popPage: () => void
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

export function PageStackProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<PageId[]>([INITIAL_PAGE_ID])
  const [direction, setDirection] = useState<Direction>(1)
  const stackRef = useRef(stack)
  stackRef.current = stack

  useLayoutEffect(() => {
    const fromHistory = readStackFromHistory()
    if (fromHistory) {
      setStack(fromHistory)
      return
    }
    const initial = [INITIAL_PAGE_ID]
    window.history.replaceState(
      mergeHistoryState({ [HISTORY_STACK_KEY]: initial }),
      '',
      window.location.href,
    )
  }, [])

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
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const pushPage = useCallback((id: PageId) => {
    if (!isRegisteredPageId(id)) return
    const next = [...stackRef.current, id]
    setDirection(1)
    window.history.pushState(
      mergeHistoryState({ [HISTORY_STACK_KEY]: next }),
      '',
      window.location.href,
    )
    stackRef.current = next
    setStack(next)
  }, [])

  const popPage = useCallback(() => {
    if (stackRef.current.length <= 1) return
    window.history.back()
  }, [])

  const value = useMemo<PageStackContextValue>(() => {
    const currentPageId = stack[stack.length - 1]!
    return {
      currentPageId,
      stackKey: stack.join('/'),
      canGoBack: stack.length > 1,
      navigationDirection: direction,
      pushPage,
      popPage,
    }
  }, [stack, direction, pushPage, popPage])

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
          className="absolute inset-0 flex min-h-0 flex-col overflow-y-auto bg-transparent"
        >
          <Page />
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
