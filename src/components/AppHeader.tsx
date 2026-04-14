import { CircleUser } from 'lucide-react'

export function AppHeader() {
  return (
    <header
      className="flex h-[80px] w-full items-center justify-between bg-white px-4 shadow-[0_0_4px_0_rgba(0,0,0,0.25)]"
      role="banner"
    >
      <span className="font-sans text-[24px] leading-none text-text-heading">
        Find the emotion
      </span>
      <button
        type="button"
        aria-label="User profile"
        className="rounded-full p-1 text-primary transition-colors hover:text-primary-hover active:text-primary-active"
      >
        <CircleUser size={28} />
      </button>
    </header>
  )
}
