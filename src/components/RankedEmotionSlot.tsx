import { ChevronDown, ChevronUp, X } from 'lucide-react'

export type RankedEmotionSlotProps = {
  rank: "1" | "2" | "3" | "4" | "5"
  emotionLabel?: string
  onSelectEmotion: () => void
  onRemove: () => void
  moveUp: () => void
  moveDown: () => void
  disabled?: boolean
}

export function RankedEmotionSlot({
  rank = "1",
  emotionLabel,
  onSelectEmotion,
  onRemove,
  moveUp,
  moveDown,
  disabled = false,
}: RankedEmotionSlotProps) {
  const hasSelection = Boolean(emotionLabel?.trim())

  return (
    <div className="grid grid-cols-[40px_minmax(0,1fr)_24px] items-center gap-[10px]">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary">
        <span className="inline-block text-center font-heading text-[20px] font-bold leading-none text-text-heading">
          {rank}
        </span>
      </div>

      <div
        className={`flex h-16 w-full items-center px-1 rounded-full transition-colors ${hasSelection ? 'bg-primary text-primary-foreground' : 'bg-surface text-text-muted'}`}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={onSelectEmotion}
          className="min-w-0 flex-1 px-4 text-left disabled:cursor-not-allowed"
        >
          <span
            className={hasSelection ? 'font-heading text-[clamp(9px,2.8vw,14px)] font-bold uppercase leading-none' : 'font-sans text-[clamp(14px,4vw,16px)] font-normal leading-none'}
          >
            {hasSelection ? emotionLabel : 'Select emotion'}
          </span>
        </button>

        {hasSelection ? (
          <div className="mr-2 flex items-center gap-1">
            <button
              type="button"
              disabled={disabled}
              aria-label="Move emotion up"
              onClick={moveUp}
              className="flex h-6 w-6 items-center justify-center text-primary-foreground transition-opacity hover:opacity-80 disabled:cursor-not-allowed"
            >
              <ChevronUp size={24} />
            </button>
            <button
              type="button"
              disabled={disabled}
              aria-label="Move emotion down"
              onClick={moveDown}
              className="flex h-6 w-6 items-center justify-center text-primary-foreground transition-opacity hover:opacity-80 disabled:cursor-not-allowed"
            >
              <ChevronDown size={24} />
            </button>
          </div>
        ) : null}
      </div>

      {hasSelection ? (
        <button
          type="button"
          disabled={disabled}
          aria-label="Remove emotion slot"
          onClick={onRemove}
          className="flex h-6 w-6 items-center justify-center text-text-heading transition-colors hover:text-primary disabled:cursor-not-allowed"
        >
          <X size={24} />
        </button>
      ) : (
        <span className="block h-6 w-6" aria-hidden="true" />
      )}

    </div>
  )
}
