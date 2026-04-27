import { reduceHistory } from '@/state/reducer/history'
import { reducePassContent } from '@/state/reducer/passContent'
import { reducePassLifecycle } from '@/state/reducer/passLifecycle'
import type { FindEmotionAction, FindEmotionState } from './types'

export function findEmotionReducer(
  state: FindEmotionState,
  action: FindEmotionAction,
): FindEmotionState {
  const nextFromPassContent = reducePassContent(state, action)
  if (nextFromPassContent) return nextFromPassContent

  const nextFromPassLifecycle = reducePassLifecycle(state, action)
  if (nextFromPassLifecycle) return nextFromPassLifecycle

  const nextFromHistory = reduceHistory(state, action)
  if (nextFromHistory) return nextFromHistory

  return state
}
