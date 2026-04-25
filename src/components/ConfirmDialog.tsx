import { useEffect, useId } from 'react'
import { createPortal } from 'react-dom'
import { PrimaryButton } from '@/components/PrimaryButton'
import { SecondaryButton } from '@/components/SecondaryButton'

export type ConfirmDialogProps = {
  open: boolean
  title: string
  message: string
  cancelLabel: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  title,
  message,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const titleId = useId()
  const messageId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={messageId}
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
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
          {title}
        </h2>
        <p
          id={messageId}
          className="mb-6 text-left text-base leading-relaxed text-text-primary"
        >
          {message}
        </p>
        <div className="flex flex-col gap-3">
          <SecondaryButton label={cancelLabel} onClick={onCancel} />
          <PrimaryButton label={confirmLabel} onClick={onConfirm} />
        </div>
      </div>
    </div>,
    document.body,
  )
}
