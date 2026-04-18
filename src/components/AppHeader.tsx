import { ChevronLeft } from 'lucide-react'
import { usePageStack } from '@/navigation/PageStackContext'

export function AppHeader() {
  const { canGoBack, popPage } = usePageStack()

  return (
    <header
      className="flex h-[80px] w-full shrink-0 items-center justify-between bg-white px-4 shadow-[0_0_4px_0_rgba(0,0,0,0.25)]"
      role="banner"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <button
          type="button"
          aria-label="Go back"
          disabled={!canGoBack}
          onClick={() => popPage()}
          className="flex shrink-0 items-center justify-center rounded-full p-1 text-text-heading transition-colors hover:bg-surface active:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:active:bg-transparent"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="truncate font-sans text-[24px] leading-none text-text-heading">
          Find the emotion
        </span>
      </div>
    </header>
  )
}
