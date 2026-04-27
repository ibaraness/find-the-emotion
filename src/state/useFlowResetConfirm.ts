import { useCallback, useRef, useState, type Dispatch } from 'react'
import type { FindEmotionAction } from '@/state/types'

/**
 * When applying a “destructive” edit, which reducer steps to run first (in this order).
 * Only include flags that should run on confirm; omit or set false to skip.
 */
export type FlowResetConfirmOptions = {
  discardFuturePasses?: boolean
  clearStrongEmotions?: boolean
  clearStrongestSingle?: boolean
}

type UseFlowResetConfirmParams = {
  dispatch: Dispatch<FindEmotionAction>
  /** If false, the next `handleActionRequest(apply)` runs `apply` immediately. */
  shouldConfirm: boolean
  /** Reset steps to run (before `apply`) when the user confirms. */
  resetOptionsOnConfirm: FlowResetConfirmOptions
}

/**
 * Deduplicate the “flow reset” confirm pattern: optional dialog, then ordered
 * dispatches (`discard_later_passes` → clear strongs → clear single) and the
 * page’s `apply` callback.
 */
export function useFlowResetConfirm({
  dispatch,
  shouldConfirm,
  resetOptionsOnConfirm,
}: UseFlowResetConfirmParams) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const pendingActionRef = useRef<(() => void) | null>(null)

  const handleActionRequest = useCallback(
    (executeAction: () => void) => {
      if (!shouldConfirm) {
        executeAction()
        return
      }
      pendingActionRef.current = executeAction
      setIsDialogOpen(true)
    },
    [shouldConfirm],
  )

  const onCancel = useCallback(() => {
    pendingActionRef.current = null
    setIsDialogOpen(false)
  }, [])

  const onConfirm = useCallback(() => {
    const executeAction = pendingActionRef.current
    pendingActionRef.current = null
    if (!executeAction) {
      setIsDialogOpen(false)
      return
    }
    setIsDialogOpen(false)
    const { discardFuturePasses, clearStrongEmotions, clearStrongestSingle } =
      resetOptionsOnConfirm
    if (discardFuturePasses) {
      dispatch({ type: 'discard_later_passes' })
    }
    if (clearStrongEmotions) {
      dispatch({ type: 'clear_strong_emotions' })
    }
    if (clearStrongestSingle) {
      dispatch({ type: 'clear_dominant_emotion' })
    }
    executeAction()
  }, [dispatch, resetOptionsOnConfirm])

  return {
    isDialogOpen,
    handleActionRequest,
    onCancel,
    onConfirm,
  }
}
