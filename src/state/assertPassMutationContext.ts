import type { FindEmotionState } from './types'
import { PassContextInvalidError } from './PassContextInvalidError'

/**
 * Ensures the live session still has the same pass at `activePass` as the page
 * instance was mounted with (`expectedPassId`). Call before pass-scoped dispatches.
 */
export function assertPassMutationContext(
  state: FindEmotionState,
  expectedPassId: string,
): void {
  if (state.passes.length === 0) {
    throw new PassContextInvalidError()
  }
  const { activePass, passes } = state
  if (activePass < 0 || activePass >= passes.length) {
    throw new PassContextInvalidError()
  }
  if (passes[activePass]!.id !== expectedPassId) {
    throw new PassContextInvalidError()
  }
}
