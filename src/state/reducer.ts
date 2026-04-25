import type { FindEmotionAction, FindEmotionState, Pass } from './types'

function createNewPass(): Pass {
  return {
    id: crypto.randomUUID(),
    selectedStateIds: [],
    selectedEmotionIds: [],
    strongestEmotionIds: [],
    strongestSinglePickId: null,
  }
}

function updateActivePass(
  state: FindEmotionState,
  update: (pass: Pass) => Pass,
): FindEmotionState {
  const i = state.activePass
  if (i < 0 || i >= state.passes.length) return state
  const nextPasses = state.passes.map((p, idx) => (idx === i ? update(p) : p))
  return { ...state, passes: nextPasses }
}

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

export function findEmotionReducer(
  state: FindEmotionState,
  action: FindEmotionAction,
): FindEmotionState {
  switch (action.type) {
    case 'toggle_state': {
      const selectedStateIds = [action.id]
      return updateActivePass(state, (p) => ({ ...p, selectedStateIds }))
    }

    case 'toggle_emotion': {
      return updateActivePass(state, (p) => {
        const exists = p.selectedEmotionIds.includes(action.id)
        const selectedEmotionIds = exists
          ? p.selectedEmotionIds.filter((id) => id !== action.id)
          : p.selectedEmotionIds.length >= 7
            ? p.selectedEmotionIds
            : [...p.selectedEmotionIds, action.id]
        return { ...p, selectedEmotionIds }
      })
    }

    case 'set_strongest_single': {
      return updateActivePass(state, (p) => {
        if (!p.strongestEmotionIds.includes(action.id)) return p
        return { ...p, strongestSinglePickId: action.id }
      })
    }

    case 'add_strong_emotion': {
      return updateActivePass(state, (p) => {
        const exists = p.strongestEmotionIds.includes(action.id)
        const strongestEmotionIds = exists
          ? p.strongestEmotionIds
          : p.strongestEmotionIds.length >= 3
            ? p.strongestEmotionIds
            : [...p.strongestEmotionIds, action.id]
        return { ...p, strongestEmotionIds }
      })
    }

    case 'remove_strong_emotion': {
      return updateActivePass(state, (p) => ({
        ...p,
        strongestEmotionIds: p.strongestEmotionIds.filter((id) => id !== action.id),
      }))
    }

    case 'move_up_emotion': {
      return updateActivePass(state, (p) => {
        if (p.strongestEmotionIds.length <= 1) return p
        const index = p.strongestEmotionIds.indexOf(action.id)
        if (index === -1) return p
        const strongestEmotionIds = [...p.strongestEmotionIds]
        const targetIndex =
          index === 0 ? strongestEmotionIds.length - 1 : index - 1
        ;[strongestEmotionIds[index], strongestEmotionIds[targetIndex]] = [
          strongestEmotionIds[targetIndex],
          strongestEmotionIds[index],
        ]
        return { ...p, strongestEmotionIds }
      })
    }

    case 'move_down_emotion': {
      return updateActivePass(state, (p) => {
        if (p.strongestEmotionIds.length <= 1) return p
        const index = p.strongestEmotionIds.indexOf(action.id)
        if (index === -1) return p
        const strongestEmotionIds = [...p.strongestEmotionIds]
        const targetIndex =
          index === strongestEmotionIds.length - 1 ? 0 : index + 1
        ;[strongestEmotionIds[index], strongestEmotionIds[targetIndex]] = [
          strongestEmotionIds[targetIndex],
          strongestEmotionIds[index],
        ]
        return { ...p, strongestEmotionIds }
      })
    }

    case 'next_step':
      return {
        ...state,
        currentStep: action.nextStep,
        direction: 1,
      }

    case 'prev_step':
      return {
        ...state,
        currentStep: action.prevStep,
        direction: -1,
      }

    case 'clear_states':
      return updateActivePass(state, (p) => ({ ...p, selectedStateIds: [] }))

    case 'clear_emotions':
      return updateActivePass(state, (p) => ({ ...p, selectedEmotionIds: [] }))

    case 'clear_strong_emotions':
      return updateActivePass(state, (p) => ({
        ...p,
        strongestEmotionIds: [],
        strongestSinglePickId: null,
      }))

    case 'clear_strongest_single':
      return updateActivePass(state, (p) => ({
        ...p,
        strongestSinglePickId: null,
      }))

    case 'set_session_trace': {
      const h = action.history
      const historyIndex = h.length > 0 ? h.length - 1 : -1
      return syncActivePassFromCurrentHistoryEntry({
        ...state,
        history: h,
        historyIndex,
      })
    }

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

    case 'update_active_pass': {
      if (state.passes.length === 0) {
        return { ...state, activePass: 0 }
      }
      const next =
        action.index >= 0 && action.index < state.passes.length
          ? action.index
          : 0
      return { ...state, activePass: next }
    }

    default:
      return state
  }
}
