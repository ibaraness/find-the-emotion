const primaryButtonClasses =
  'w-full py-[16px] px-[16px] text-center bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active active:scale-[0.99] disabled:bg-primary-disabled disabled:cursor-not-allowed rounded-full transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2'

export type PrimaryButtonProps = {
  label: string
  onClick: () => void
  disabled?: boolean
}

export function PrimaryButton({
  label,
  onClick,
  disabled = false,
}: PrimaryButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={primaryButtonClasses}
    >
      {label}
    </button>
  )
}
