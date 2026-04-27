import type { FindEmotionAction, FindEmotionState } from '@/state/types'
import { updateActivePass } from '@/state/reducer/shared'

export function reducePassContent(
  state: FindEmotionState,
  action: FindEmotionAction,
): FindEmotionState | null {
  switch (action.type) {
    case 'toggle_state': {
      const selectedStateIds = [action.id]
      return updateActivePass(state, (p) => ({ ...p, selectedStateIds }))
    }

    case 'toggle_emotion':
      return updateActivePass(state, (p) => {
        const exists = p.selectedEmotionIds.includes(action.id)
        const selectedEmotionIds = exists
          ? p.selectedEmotionIds.filter((id) => id !== action.id)
          : p.selectedEmotionIds.length >= 7
            ? p.selectedEmotionIds
            : [...p.selectedEmotionIds, action.id]
        return { ...p, selectedEmotionIds }
      })

    case 'set_dominant_emotion':
      return updateActivePass(state, (p) => {
        if (!p.strongEmotionIds.includes(action.id)) return p
        return { ...p, dominantEmotionId: action.id }
      })

    case 'add_strong_emotion':
      return updateActivePass(state, (p) => {
        const exists = p.strongEmotionIds.includes(action.id)
        const strongEmotionIds = exists
          ? p.strongEmotionIds
          : p.strongEmotionIds.length >= 3
            ? p.strongEmotionIds
            : [...p.strongEmotionIds, action.id]
        return { ...p, strongEmotionIds }
      })

    case 'remove_strong_emotion':
      return updateActivePass(state, (p) => ({
        ...p,
        strongEmotionIds: p.strongEmotionIds.filter((id) => id !== action.id),
      }))

    case 'move_up_emotion':
      return updateActivePass(state, (p) => {
        if (p.strongEmotionIds.length <= 1) return p
        const index = p.strongEmotionIds.indexOf(action.id)
        if (index === -1) return p
        const strongEmotionIds = [...p.strongEmotionIds]
        const targetIndex = index === 0 ? strongEmotionIds.length - 1 : index - 1
        ;[strongEmotionIds[index], strongEmotionIds[targetIndex]] = [
          strongEmotionIds[targetIndex],
          strongEmotionIds[index],
        ]
        return { ...p, strongEmotionIds }
      })

    case 'move_down_emotion':
      return updateActivePass(state, (p) => {
        if (p.strongEmotionIds.length <= 1) return p
        const index = p.strongEmotionIds.indexOf(action.id)
        if (index === -1) return p
        const strongEmotionIds = [...p.strongEmotionIds]
        const targetIndex =
          index === strongEmotionIds.length - 1 ? 0 : index + 1
        ;[strongEmotionIds[index], strongEmotionIds[targetIndex]] = [
          strongEmotionIds[targetIndex],
          strongEmotionIds[index],
        ]
        return { ...p, strongEmotionIds }
      })

    case 'clear_states':
      return updateActivePass(state, (p) => ({ ...p, selectedStateIds: [] }))

    case 'clear_emotions':
      return updateActivePass(state, (p) => ({ ...p, selectedEmotionIds: [] }))

    case 'clear_strong_emotions':
      return updateActivePass(state, (p) => ({
        ...p,
        strongEmotionIds: [],
        dominantEmotionId: null,
      }))

    case 'clear_dominant_emotion':
      return updateActivePass(state, (p) => ({
        ...p,
        dominantEmotionId: null,
      }))

    default:
      return null
  }
}
