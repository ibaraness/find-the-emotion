import { useEffect, useId } from 'react'
import { createPortal } from 'react-dom'
import { PrimaryButton } from '@/components/PrimaryButton'
import { PassContextInvalidError } from '@/state/PassContextInvalidError'

export type PassSessionInvalidDialogProps = {
  open: boolean
  onDismiss: () => void
}

export function PassSessionInvalidDialog({
  open,
  onDismiss,
}: PassSessionInvalidDialogProps) {
  const titleId = useId()
  const messageId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onDismiss])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={messageId}
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onDismiss}
        role="presentation"
      />
      <div
        className="relative w-full max-w-md rounded-2xl bg-background p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id={titleId}
          className="mb-3 text-left text-lg font-medium leading-snug text-text-heading"
        >
          Session out of sync
        </h2>
        <p
          id={messageId}
          className="mb-6 text-left text-base leading-relaxed text-text-primary"
        >
          {PassContextInvalidError.userMessage}
        </p>
        <PrimaryButton label="OK" onClick={onDismiss} />
      </div>
    </div>,
    document.body,
  )
}
