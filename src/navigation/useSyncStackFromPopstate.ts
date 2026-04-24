import { useEffect } from 'react'
import type { Dispatch, MutableRefObject, SetStateAction } from 'react'
import type { FindEmotionAction, HistoryEntry } from '@/state/types'
import { isObjectRecord } from '@/lib/typeGuards'
import { INITIAL_PAGE_ID, type PageId } from './pageRegistry'
import type { Direction } from './types'
import {
  HISTORY_STACK_KEY,
  SESSION_HISTORY_KEY,
  buildSessionTraceFromState,
  mergeHistoryState,
  sanitizeStack,
} from './historyState'

type UseSyncStackFromPopstateParams = {
  stackRef: MutableRefObject<PageId[]>
  setStack: Dispatch<SetStateAction<PageId[]>>
  setDirection: Dispatch<SetStateAction<Direction>>
  dispatch: Dispatch<FindEmotionAction>
  pendingPruneAfterGoBackRef: MutableRefObject<boolean>
  pruneFallbackTimerRef: MutableRefObject<ReturnType<typeof setTimeout> | null>
}

/**
 * Keep internal stack and session trace in sync with browser back/forward events.
 * Also finalizes "start over" prune flow after jumping back to root entry.
 */
export function useSyncStackFromPopstate({
  stackRef,
  setStack,
  setDirection,
  dispatch,
  pendingPruneAfterGoBackRef,
  pruneFallbackTimerRef,
}: UseSyncStackFromPopstateParams): void {
  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      const raw =
        isObjectRecord(e.state) ? e.state[HISTORY_STACK_KEY] : undefined
      const nextStack = sanitizeStack(raw)
      const prevStackLength = stackRef.current.length
      setDirection(nextStack.length < prevStackLength ? -1 : 1)
      setStack(nextStack)
      stackRef.current = nextStack
      const trace = buildSessionTraceFromState(e.state, nextStack)
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
  }, [
    dispatch,
    pendingPruneAfterGoBackRef,
    pruneFallbackTimerRef,
    setDirection,
    setStack,
    stackRef,
  ])
}
