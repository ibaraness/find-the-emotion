import type { FindEmotionAction, FindEmotionState } from '@/state/types'
import { createNewPass } from '@/state/reducer/shared'

export function reducePassLifecycle(
  state: FindEmotionState,
  action: FindEmotionAction,
): FindEmotionState | null {
  switch (action.type) {
    case 'reset_session_history':
      return {
        ...state,
        history: [],
        historyIndex: -1,
        passes: [createNewPass()],
        activePass: 0,
      }

    case 'add_pass': {
      const newPass = createNewPass()
      const nextPasses = [...state.passes, newPass]
      return {
        ...state,
        passes: nextPasses,
        activePass: nextPasses.length - 1,
      }
    }

    case 'discard_later_passes': {
      if (state.passes.length === 0) return { ...state, activePass: 0 }
      const i =
        state.activePass < 0
          ? 0
          : Math.min(state.activePass, state.passes.length - 1)
      const nextPasses = state.passes.slice(0, i + 1)
      return { ...state, passes: nextPasses, activePass: i }
    }

    default:
      return null
  }
}
