import { useLayoutEffect, useRef } from 'react'
import { usePageStack } from '@/navigation/PageStackContext'
import { useFindEmotionDispatch, useFindEmotionState } from '@/state/context'

/**
 * Keeps `history` / `historyIndex` in sync with the page stack: appends a
 * {@link import('@/state/types').HistoryEntry} when the stack moves forward
 * (each step records the new top route id as `screen`), and decrements the
 * index on back.
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
