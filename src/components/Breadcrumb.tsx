const defaultMarginTopClassName = 'mt-4'
const defaultMarginBottomClassName = 'mb-10'

const rootTypographyClassName =
  'text-center font-light tracking-wide text-[clamp(10px,2.5vw,12px)] text-text-primary'

export type BreadcrumbProps = {
  label: string
  /** Top margin; default `mt-4`. Pass `mt-0` (or another utility) to reset or replace. */
  marginTopClassName?: string
  /** Bottom margin; default `mb-10`. */
  marginBottomClassName?: string
  /** Extra classes on the root element (e.g. alignment tweaks). */
  className?: string
}

export function Breadcrumb({
  label,
  marginTopClassName = defaultMarginTopClassName,
  marginBottomClassName = defaultMarginBottomClassName,
  className,
}: BreadcrumbProps) {
  return (
    <div
      className={[marginTopClassName, marginBottomClassName, rootTypographyClassName, className]
        .filter(Boolean)
        .join(' ')}
    >
      {label}
    </div>
  )
}
