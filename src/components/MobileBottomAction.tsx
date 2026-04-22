import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'

export type MobileBottomActionProps = {
  children: ReactNode
  /** `sticky` stays within the scroll container; `fixed` pins to viewport bottom. */
  position?: 'sticky' | 'fixed'
  className?: string
}

export function MobileBottomAction({
  children,
  position = 'sticky',
  className = '',
}: MobileBottomActionProps) {
  if (position === 'fixed') {
    return (
      createPortal(
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
          className={`fixed inset-x-0 bottom-0 z-40 w-full bg-background px-4 pt-8 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] md:hidden ${className}`}
        >
          <div className="w-full pb-8">
            {children}
          </div>
        </motion.div>,
        document.body,
      )
    )
  }

  return (
    <div className={`sticky bottom-0 z-20 w-full bg-background px-4 pt-8 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] md:hidden ${className}`}>
      <div className="w-full pb-8">
        {children}
      </div>
    </div>
  )
}
