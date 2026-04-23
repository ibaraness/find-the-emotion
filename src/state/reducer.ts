import type {
  FindEmotionAction,
  FindEmotionState,
  HistoryEntry,
  Pass,
} from './types'

function updateActivePass(
  state: FindEmotionState,
  update: (pass: Pass) => Pass,
): FindEmotionState {
  const i = state.activePass
  if (i < 0 || i >= state.passes.length) return state
  const nextPasses = state.passes.map((p, idx) => (idx === i ? update(p) : p))
  return { ...state, passes: nextPasses }
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

    case 'history_forward': {
      const entry: HistoryEntry = {
        passIndex: action.passIndex,
        screen: action.screen,
      }
      const next = state.history.slice(0, state.historyIndex + 1)
      next.push(entry)
      return {
        ...state,
        history: next,
        historyIndex: next.length - 1,
      }
    }

    case 'history_back': {
      if (state.historyIndex < 0) return state
      return { ...state, historyIndex: state.historyIndex - 1 }
    }

    case 'reset_session_history':
      return { ...state, history: [], historyIndex: -1 }

    default:
      return state
  }
}
