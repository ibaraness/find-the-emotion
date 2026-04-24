import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useFindEmotionDispatch, useFindEmotionState } from '@/state/context'
import type { HistoryEntry, Screen } from '@/state/types'
import {
  HISTORY_STACK_KEY,
  SESSION_HISTORY_KEY,
  buildSessionTraceFromState,
  mergeHistoryState,
} from './historyState'
import {
  INITIAL_PAGE_ID,
  isRegisteredPageId,
  pageRegistry,
  type PageId,
} from './pageRegistry'
import { pageMetaTitleById } from './pageMeta'
import type {
  Direction,
  PageStackContextValue,
  PushPageOptions,
} from './types'
import { useInitializePageStack } from './useInitializePageStack'
import { useSyncStackFromPopstate } from './useSyncStackFromPopstate'

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

  // On first mount, hydrate stack/trace from browser history or seed initial root state.
  useInitializePageStack({ setStack, dispatch })
  
  // Keep stack/trace synchronized with browser back-forward events and finalize root-prune flow.
  useSyncStackFromPopstate({
    stackRef,
    setStack,
    setDirection,
    dispatch,
    pendingPruneAfterGoBackRef,
    pruneFallbackTimerRef,
  })

  // Keep browser tab title in sync with the currently visible page.
  useEffect(() => {
    document.title = pageMetaTitleById[currentPageId]
  }, [currentPageId])

  const pushPage = useCallback(
    (id: PageId, options?: PushPageOptions) => {
      if (!isRegisteredPageId(id)) return
      const passIndexForNewEntry = options?.passIndex ?? activePass
      const currentStack = stackRef.current
      const prevSession = buildSessionTraceFromState(window.history.state, currentStack)
      const nextStack = [...currentStack, id]
      const nextSession: HistoryEntry[] = [
        ...prevSession,
        { passIndex: passIndexForNewEntry, screen: id as Screen },
      ]
      setDirection(1)
      window.history.pushState(
        mergeHistoryState({
          [HISTORY_STACK_KEY]: nextStack,
          [SESSION_HISTORY_KEY]: nextSession,
        }),
        '',
        window.location.href,
      )
      stackRef.current = nextStack
      setStack(nextStack)
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
    const currentStack = stackRef.current
    if (currentStack.length <= 1) {
      window.history.replaceState(
        mergeHistoryState({
          [HISTORY_STACK_KEY]: [target],
          [SESSION_HISTORY_KEY]: [] satisfies HistoryEntry[],
        }),
        '',
        window.location.href,
      )
      if (currentStack[0] === target) {
        dispatch({ type: 'set_session_trace', history: [] })
        return
      }
      setDirection(1)
      stackRef.current = [target]
      setStack([target])
      dispatch({ type: 'set_session_trace', history: [] })
      return
    }
    const stepsBack = currentStack.length - 1
    pendingPruneAfterGoBackRef.current = true
    if (pruneFallbackTimerRef.current) clearTimeout(pruneFallbackTimerRef.current)
    pruneFallbackTimerRef.current = setTimeout(() => {
      pruneFallbackTimerRef.current = null
      pendingPruneAfterGoBackRef.current = false
    }, 400)
    window.history.go(-stepsBack)
  }, [dispatch])

  const contextValue = useMemo<PageStackContextValue>(() => {
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
    <PageStackContext.Provider value={contextValue}>{children}</PageStackContext.Provider>
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
