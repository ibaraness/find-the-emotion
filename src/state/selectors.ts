import { getActivePass } from '@/state/context'
import type { FindEmotionState } from '@/state/types'

export function selectHasFuturePasses(state: FindEmotionState): boolean {
  return state.passes.length > 0 && state.activePass < state.passes.length - 1
}

export function selectHasAnyStrongEmotions(state: FindEmotionState): boolean {
  const passForEdit = getActivePass(state)
  return passForEdit.strongestEmotionIds.length > 0
}

export function selectHasStrongestSinglePick(state: FindEmotionState): boolean {
  const passForEdit = getActivePass(state)
  return passForEdit.strongestSinglePickId != null
}
