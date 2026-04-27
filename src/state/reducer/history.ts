import type { FindEmotionAction, FindEmotionState } from '@/state/types'

/** Align `activePass` with the `passIndex` stored on the entry at `history[historyIndex]`. */
function syncActivePassFromCurrentHistoryEntry(
  state: FindEmotionState,
): FindEmotionState {
  if (state.passes.length === 0) {
    return { ...state, activePass: 0 }
  }
  if (state.historyIndex < 0 || state.historyIndex >= state.history.length) {
    return state
  }
  const entry = state.history[state.historyIndex]
  if (!entry) return state
  let target = entry.passIndex
  const max = state.passes.length - 1
  if (target < 0) target = 0
  if (target > max) target = max
  if (target === state.activePass) return state
  return { ...state, activePass: target }
}

export function reduceHistory(
  state: FindEmotionState,
  action: FindEmotionAction,
): FindEmotionState | null {
  switch (action.type) {
    case 'set_session_trace': {
      const h = action.history
      const historyIndex = h.length > 0 ? h.length - 1 : -1
      return syncActivePassFromCurrentHistoryEntry({
        ...state,
        history: h,
        historyIndex,
      })
    }

    case 'update_active_pass': {
      if (state.passes.length === 0) {
        if (import.meta.env.DEV) {
          console.warn('[findEmotion] update_active_pass: passes is empty', {
            requestedIndex: action.index,
          })
        }
        return state
      }
      if (action.index < 0 || action.index >= state.passes.length) {
        if (import.meta.env.DEV) {
          console.warn('[findEmotion] update_active_pass: index out of range (ignored)', {
            requestedIndex: action.index,
            activePass: state.activePass,
            passCount: state.passes.length,
          })
        }
        return state
      }
      return { ...state, activePass: action.index }
    }

    default:
      return null
  }
}
