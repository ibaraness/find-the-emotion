export type BreadcrumbProps = {
  label: string
}

export function Breadcrumb({ label }: BreadcrumbProps) {
  return (
    <div className="mt-4 mb-10 text-center font-light tracking-wide text-[clamp(12px,3.26vw,15px)] text-text-primary">
      {label}
    </div>
  )
}
