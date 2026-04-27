import type { ReactNode } from 'react'
import { MobileBottomAction } from '@/components/MobileBottomAction'

type ResponsiveBottomActionsProps = {
  children: ReactNode
  mobilePosition?: 'sticky' | 'fixed'
  mobileClassName?: string
  desktopClassName?: string
}

export function ResponsiveBottomActions({
  children,
  mobilePosition = 'fixed',
  mobileClassName,
  desktopClassName = 'mt-8 hidden pb-20 md:block',
}: ResponsiveBottomActionsProps) {
  return (
    <>
      <MobileBottomAction position={mobilePosition} className={mobileClassName}>
        {children}
      </MobileBottomAction>
      <div className={desktopClassName}>{children}</div>
    </>
  )
}
