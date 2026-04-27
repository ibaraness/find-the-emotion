import type { FindEmotionState, Pass } from '@/state/types'
import { normalizePass } from '@/state/reducer/normalizePass'

export function createNewPass(): Pass {
  return {
    id: crypto.randomUUID(),
    selectedStateIds: [],
    selectedEmotionIds: [],
    strongEmotionIds: [],
    dominantEmotionId: null,
  }
}

export function updateActivePass(
  state: FindEmotionState,
  update: (pass: Pass) => Pass,
): FindEmotionState {
  const i = state.activePass
  if (i < 0 || i >= state.passes.length) return state
  const nextPasses = state.passes.map((p, idx) =>
    idx === i ? normalizePass(update(p)) : p,
  )
  return { ...state, passes: nextPasses }
}
