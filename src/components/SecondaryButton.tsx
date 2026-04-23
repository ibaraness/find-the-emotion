const secondaryButtonClasses =
  'w-full py-[16px] px-[16px] text-center bg-surface text-text-heading hover:bg-surface-hover active:bg-surface-active active:scale-[0.99] disabled:bg-surface disabled:text-text-muted disabled:cursor-not-allowed rounded-full transition-[background-color,color,transform] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong/40 focus-visible:ring-offset-2'

export type SecondaryButtonProps = {
  label: string
  onClick: () => void
  disabled?: boolean
}

export function SecondaryButton({
  label,
  onClick,
  disabled = false,
}: SecondaryButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={secondaryButtonClasses}
    >
      {label}
    </button>
  )
}
