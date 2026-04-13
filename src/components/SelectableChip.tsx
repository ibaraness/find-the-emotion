const baseClasses =
  'w-full py-[16px] px-[16px] text-center rounded-full transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 active:scale-[0.99]'

const unselectedClasses =
  'bg-surface text-text-primary hover:bg-surface-hover active:bg-surface-active'

const selectedClasses =
  'bg-selected text-selected-foreground hover:bg-selected-hover active:bg-selected-active'

const disabledClasses = 'opacity-70 cursor-not-allowed'

export type SelectableChipProps = {
  selected: boolean
  label: string
  onChange: (selected: boolean) => void
  disabled?: boolean
}

/** Selected option button — toggle chip with selected / unselected surface styles. */
export function SelectableChip({
  selected,
  label,
  onChange,
  disabled = false,
}: SelectableChipProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={selected}
      onClick={() => {
        if (disabled) return
        onChange(!selected)
      }}
      className={`${baseClasses} ${selected ? selectedClasses : unselectedClasses} ${disabled ? disabledClasses : ''}`}
    >
      {label}
    </button>
  )
}
