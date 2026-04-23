import { useEffect } from 'react'
import { useFindEmotionState } from '@/state/context'

/**
 * Logs the full FindEmotion state on every change (dev only).
 * Remove `<LogFindEmotionState />` from the provider, or delete this file, to disable.
 * Production builds omit mounting this component (see provider).
 */
export function LogFindEmotionState() {
  const state = useFindEmotionState()

  useEffect(() => {
    console.log('[FindEmotionState]', state)
  }, [state])

  return null
}
