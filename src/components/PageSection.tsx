import type { ReactNode } from 'react'

const shell =
  'mx-auto flex w-full max-w-md flex-1 flex-col pt-8 pb-20 min-h-0 flex-1 overflow-y-auto overscroll-y-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'

const paddingClass = {
  narrow: 'px-3',
  default: 'px-4',
  wide: 'px-8',
} as const

export type PageSectionProps = {
  children: ReactNode
  /** Horizontal padding: `narrow` (px-3), `default` (px-4), `wide` (px-8). */
  padding?: keyof typeof paddingClass
  /** Applies `text-center` on the section (inherited by children). */
  textCenter?: boolean
  className?: string
}

/** Shared full-height page column used by every screen inside the stack. */
export function PageSection({
  children,
  padding = 'default',
  textCenter = false,
  className = '',
}: PageSectionProps) {
  const classes = [
    shell,
    paddingClass[padding],
    textCenter ? 'text-center' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <section className={classes}>{children}</section>
}
