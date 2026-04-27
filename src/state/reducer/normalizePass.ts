import type { Pass } from '@/state/types'

/**
 * Enforces invariants for the pass content hierarchy:
 * - `strongEmotionIds` ⊆ `selectedEmotionIds`
 * - `dominantEmotionId` ∈ `strongEmotionIds` or `null`
 */
export function normalizePass(pass: Pass): Pass {
  const strongEmotionIds = pass.strongEmotionIds.filter((id) =>
    pass.selectedEmotionIds.includes(id),
  )
  const dominantEmotionId = strongEmotionIds.includes(
    pass.dominantEmotionId ?? '',
  )
    ? pass.dominantEmotionId
    : null
  return {
    ...pass,
    strongEmotionIds,
    dominantEmotionId,
  }
}
