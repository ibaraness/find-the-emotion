import { emotions } from '@/config/emotions'
import type { Pass } from '@/state/types'
import { ChevronRight } from 'lucide-react'

type EmotionUnfoldedChainProps = {
  passes: Pass[]
  currentPassIndex: number
}

function strongestEmotionNameFromPass(pass: Pass): string {
  const primaryEmotionId =
    pass.strongestSinglePickId ??
    (pass.strongestEmotionIds.length === 1 ? pass.strongestEmotionIds[0] : null)
  return emotions.find((emotion) => emotion.id === primaryEmotionId)?.name ?? ''
}

export function EmotionUnfoldedChain({
  passes,
  currentPassIndex,
}: EmotionUnfoldedChainProps) {
  const strongestChain = passes
    .slice(0, currentPassIndex + 1)
    .map((pass) => strongestEmotionNameFromPass(pass))
    .filter(Boolean)

  const hasPreviousPasses = currentPassIndex > 0 && strongestChain.length > 1
  if (!hasPreviousPasses) return null
  const displayedChain =
    currentPassIndex > 2 ? ['...', ...strongestChain.slice(-3)] : strongestChain

  return (
    <div className="mb-[clamp(30px,12vw,80px)]">
      <h3 className="mb-4 text-[16px] font-bold text-text-primary">
        How it unfolded
      </h3>
      <div className="flex flex-wrap items-center justify-center gap-2 text-text-primary">
        {displayedChain.map((emotionName, index) => {
          const isLast = index === displayedChain.length - 1
          return (
            <div key={`${emotionName}-${index}`} className="flex items-center gap-2">
              <span
                className={
                  isLast
                    ? 'text-[18px] font-normal text-text-heading'
                    : 'text-[16px] font-light'
                }
              >
                {emotionName}
              </span>
              {!isLast ? (
                <ChevronRight size={16} className="text-text-primary" />
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
