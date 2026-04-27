import { ConfirmDialog } from '@/components/ConfirmDialog'

export type FlowResetConfirmDialogProps = {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
  title?: string
}

export function FlowResetConfirmDialog({
  open,
  onCancel,
  onConfirm,
  title = 'Change this selection?',
}: FlowResetConfirmDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      title={title}
      message="This change will remove all steps that came after this point."
      cancelLabel="Cancel"
      confirmLabel="Change and reset"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  )
}
