import { useRef } from 'react'
import { getActivePass, useFindEmotionState } from './context'

/**
 * Freeze pass identity at mount time for the current page instance so UI does
 * not switch to another activePass mid-screen.
 */
export function useMountedPass() {
  const state = useFindEmotionState()
  const mountedPass = getActivePass(state)
  const mountedPassIndexRef = useRef(state.activePass)
  const mountedPassIdRef = useRef(mountedPass.id)
  const mountedPassRef = useRef(mountedPass)
  const { passes } = state

  const displayedPass =
    passes.find((pass) => pass.id === mountedPassIdRef.current) ??
    mountedPassRef.current

  const displayedPassIndex =
    mountedPassIndexRef.current >= 0 &&
    mountedPassIndexRef.current < passes.length
      ? mountedPassIndexRef.current
      : 0

  return { displayedPass, displayedPassIndex, state }
}
