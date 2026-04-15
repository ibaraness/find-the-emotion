import { Plus } from 'lucide-react'

export type AddEmotionRowProps = {
  label: string
  onAddition: () => void
  disabled?: boolean
}

export function AddEmotionRow({
  label,
  onAddition,
  disabled = false,
}: AddEmotionRowProps) {
  return (
    <div className="grid grid-cols-[40px_minmax(0,1fr)] items-center gap-[14px]">
      <button
        type="button"
        aria-label="Add emotion"
        disabled={disabled}
        onClick={onAddition}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-hover active:bg-primary-active disabled:cursor-not-allowed disabled:bg-primary-disabled"
      >
        <Plus size={18} />
      </button>

      <div className="font-heading text-left uppercase text-[12px] font-bold leading-none text-primary">
        {label}
      </div>
    </div>
  )
}
