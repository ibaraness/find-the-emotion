import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { PassSessionInvalidDialog } from '@/components/PassSessionInvalidDialog'

type PassSessionInvalidContextValue = {
  setPassContextInvalid: (value: boolean) => void
}

const PassSessionInvalidContext =
  createContext<PassSessionInvalidContextValue | null>(null)

export function PassSessionInvalidProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const setPassContextInvalid = useCallback((value: boolean) => {
    setOpen(value)
  }, [])

  const value = useMemo(
    () => ({ setPassContextInvalid }),
    [setPassContextInvalid],
  )

  return (
    <PassSessionInvalidContext.Provider value={value}>
      {children}
      <PassSessionInvalidDialog
        open={open}
        onDismiss={() => setOpen(false)}
      />
    </PassSessionInvalidContext.Provider>
  )
}

export function usePassSessionInvalidControls() {
  const ctx = useContext(PassSessionInvalidContext)
  if (!ctx) {
    throw new Error(
      'usePassSessionInvalidControls must be used within PassSessionInvalidProvider',
    )
  }
  return ctx
}
