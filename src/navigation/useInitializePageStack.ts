import { useLayoutEffect } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { FindEmotionAction, HistoryEntry } from '@/state/types'
import { INITIAL_PAGE_ID, type PageId } from './pageRegistry'
import {
  HISTORY_STACK_KEY,
  SESSION_HISTORY_KEY,
  buildSessionTraceFromState,
  mergeHistoryState,
  readStackFromHistory,
} from './historyState'

type UseInitializePageStackParams = {
  setStack: Dispatch<SetStateAction<PageId[]>>
  dispatch: Dispatch<FindEmotionAction>
}

/** Hydrate stack/session trace from history.state on initial mount. */
export function useInitializePageStack({
  setStack,
  dispatch,
}: UseInitializePageStackParams): void {
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
  }, [dispatch, setStack])
}
