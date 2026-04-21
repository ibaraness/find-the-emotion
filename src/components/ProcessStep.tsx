import type { ReactNode } from 'react'

export type ProcessStepProps = {
  stepNumber: string | number
  label: string
  /** Pass a React icon element, e.g. `<Heart />`. */
  icon?: ReactNode
  /** Alternative for icon-font usage, e.g. `fa-solid fa-heart`. */
  iconClassName?: string
  className?: string
}

/**
 * Three-column row: value, label, and right icon badge.
 * Designed as a standalone component or a segment for larger wrappers.
 */
export function ProcessStep({
  stepNumber,
  label,
  icon,
  iconClassName,
  className = '',
}: ProcessStepProps) {
  return (
    <div
      className={`grid h-[70px] w-full grid-cols-[70px_minmax(0,1fr)_70px] items-center overflow-hidden rounded-full bg-surface ${className}`}
    >
      <div className="flex h-full w-full items-center justify-center">
        <span className="font-heading text-[40px] leading-none text-[#8C94A6]">
          {stepNumber}
        </span>
      </div>

      <div className="min-w-0 px-2 text-left font-heading text-[18px] leading-none text-[#616C89]">
        {label}
      </div>

      <div className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-primary">
        <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full border border-white bg-transparent text-white">
          {icon ? (
            <span className="text-white [&_svg]:h-6 [&_svg]:w-6">{icon}</span>
          ) : iconClassName ? (
            <i className={`${iconClassName} text-[24px] leading-none`} aria-hidden="true" />
          ) : null}
        </div>
      </div>
    </div>
  )
}
