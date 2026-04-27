import { Breadcrumb } from '@/components/Breadcrumb'
import { EmotionUnfoldedChain } from '@/components/EmotionUnfoldedChain'
import { PageSection } from '@/components/PageSection'
import { PrimaryButton } from '@/components/PrimaryButton'
import { getEmotionNameById } from '@/config/emotions'
import { Check } from 'lucide-react'
import { usePageStack } from '@/navigation/PageStackContext'
import { useFindEmotionDispatch } from '@/state/context'
import { useMountedPass } from '@/state/useMountedPass'

/** Summary step scaffold — replace content as you build the final screen. */
export function SummaryPage() {
  const { resetPageStackToRoot } = usePageStack()
  const dispatch = useFindEmotionDispatch()
  const { displayedPass, displayedPassIndex, state } = useMountedPass()
  const { passes } = state
  const { strongEmotionIds, dominantEmotionId } = displayedPass
  const dominantEmotionIdForDisplay =
    dominantEmotionId ??
    (strongEmotionIds.length === 1 ? strongEmotionIds[0] : null)
  const strongestEmotionName = getEmotionNameById(dominantEmotionIdForDisplay)
  const alsoEmotionIds = dominantEmotionIdForDisplay
    ? strongEmotionIds.filter((id) => id !== dominantEmotionIdForDisplay)
    : []

  return (
    <PageSection padding="narrow" textCenter>
      <Breadcrumb className='uppercase' label="What we found" />
      <h1 className="mb-[clamp(30px,12vw,80px)] text-center text-[clamp(30px,8vw,48px)] font-normal leading-none tracking-tighter text-text-heading">
      What feels strongest right now is
      </h1>
      <h2 className='text-[clamp(40px,12vw,64px)] font-normal leading-none tracking-tighter text-text-heading mb-[clamp(30px,12vw,80px)]'>
        {strongestEmotionName}
      </h2>
      <EmotionUnfoldedChain
        passes={passes}
        currentPassIndex={displayedPassIndex}
      />
      {alsoEmotionIds.length > 0 ? (
        <div className="mb-4 text-base text-text-primary">
          You also feel:
        </div>
      ) : null}
      {alsoEmotionIds.length > 0 ? (
        <div className="flex flex-col justify-center items-center w-full gap-4">
          <div className="flex flex-col justify-center items-start w-fit gap-4">
            {alsoEmotionIds.map((emotionId) => (
              <div key={emotionId} className="flex items-center gap-2 text-left">
                <Check size={16} className="text-primary" />
                {getEmotionNameById(emotionId)}
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <div className="mx-auto mt-12 w-full max-w-[320px] text-left">
        <h3 className="mb-6 text-[32px] font-normal text-center leading-none tracking-tighter text-text-heading">
          What’s next?
        </h3>
        <div className="flex flex-col gap-5">
          <p className="text-[16px] text-text-heading">
            Stay with this for a moment
          </p>
          <div className="opacity-70">
            <p className="text-[16px] text-text-heading underline decoration-current">
              Understand what’s behind this feeling
            </p>
            <p className="mt-1 text-[16px] font-light italic text-text-heading">
              Available soon
            </p>
          </div>
          <div className="opacity-70">
            <p className="text-[16px] text-text-heading underline decoration-current">
              Shift how this feels right now
            </p>
            <p className="mt-1 text-[16px] font-light italic text-text-heading">
              Available soon
            </p>
          </div>
        </div>
      </div>
      <div className="mt-12 pb-20">
        <PrimaryButton
          label="Start over"
          onClick={() => {
            dispatch({ type: 'reset_session_history' })
            resetPageStackToRoot()
          }}
        />
      </div>
    </PageSection>
  )
}
