import { useLayoutEffect, useRef } from 'react'
import { usePageStack } from '../navigation/PageStackContext'
import { useFindEmotionDispatch, useFindEmotionState } from './context'

/**
 * Keeps `history` / `historyIndex` in sync with the page stack: on forward,
 * the reducer reuses a matching next {@link import('./types').HistoryEntry}
 * in the list (e.g. browser “forward” after back) or appends a new one using
 * `activePass` for `passIndex` when the step is new. On back, decrements
 * the index.
 */
export function NavigationHistoryBridge() {
  const { currentPageId, stackKey } = usePageStack()
  const { activePass } = useFindEmotionState()
  const dispatch = useFindEmotionDispatch()
  const prevStackKeyRef = useRef('')

  useLayoutEffect(() => {
    const prev = prevStackKeyRef.current
    if (prev === '') {
      prevStackKeyRef.current = stackKey
      return
    }
    if (prev === stackKey) return

    const prevDepth = prev.split('/').filter(Boolean).length
    const nextDepth = stackKey.split('/').filter(Boolean).length

    if (nextDepth > prevDepth) {
      dispatch({
        type: 'history_forward',
        passIndex: activePass,
        screen: currentPageId,
      })
    } else if (nextDepth < prevDepth) {
      dispatch({ type: 'history_back' })
    }

    prevStackKeyRef.current = stackKey
  }, [stackKey, currentPageId, activePass, dispatch])

  return null
}
