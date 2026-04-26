import { useCallback, useRef } from 'react'
import { assertPassMutationContext } from '@/state/assertPassMutationContext'
import { PassContextInvalidError } from '@/state/PassContextInvalidError'
import { useFindEmotionState } from '@/state/context'
import { usePassSessionInvalidControls } from '@/state/PassSessionInvalidContext'

/**
 * Validates that `passes[activePass]` still matches the pass this page instance
 * was mounted with (see `useMountedPass`’s `mountedPassId`) before running pass-
 * scoped side effects. On mismatch, shows a global dialog instead of dispatching.
 *
 * Pass the same `mountedPassId` returned from `useMountedPass()` in this component
 * (do not call `useMountedPass` twice).
 */
export function useSessionPassGuard(mountedPassId: string) {
  const state = useFindEmotionState()
  const { setPassContextInvalid } = usePassSessionInvalidControls()
  const stateRef = useRef(state)
  const mountedIdRef = useRef(mountedPassId)
  stateRef.current = state
  mountedIdRef.current = mountedPassId

  const withPassContext = useCallback(
    (fn: () => void) => {
      try {
        assertPassMutationContext(stateRef.current, mountedIdRef.current)
        fn()
      } catch (e) {
        if (e instanceof PassContextInvalidError) {
          setPassContextInvalid(true)
          return
        }
        throw e
      }
    },
    [setPassContextInvalid],
  )

  return { withPassContext }
}
