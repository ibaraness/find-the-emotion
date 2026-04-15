import { PageSection } from '@/components/PageSection'
import { PrimaryButton } from '@/components/PrimaryButton'
import { emotions } from '@/config/emotions'
import { Check } from 'lucide-react'
import { usePageStack } from '@/navigation/PageStackContext'
import { useFindEmotionDispatch, useFindEmotionState } from '@/state/context'

/** Summary step scaffold — replace content as you build the final screen. */
export function SummaryPage() {
  const { pushPage } = usePageStack()
  const dispatch = useFindEmotionDispatch()
  const { strongestEmotionIds } = useFindEmotionState()
  const firstStrongEmotionName =
    emotions.find((emotion) => emotion.id === strongestEmotionIds[0])?.name ?? ''

  return (
    <PageSection padding="narrow" textCenter>
      <div className="mt-4 mb-10 text-center text-[clamp(12px,3.26vw,15px)] text-text-primary">
        STEP 4: SUMMARY
      </div>
      <h1 className="mb-[clamp(30px,12vw,80px)] text-center text-[clamp(30px,8vw,48px)] font-normal leading-none tracking-tighter text-text-heading">
      What feels strongest right now is
      </h1>
      <h2 className='text-[clamp(40px,12vw,64px)] font-normal leading-none tracking-tighter text-text-heading mb-[clamp(30px,12vw,80px)]'>
        {firstStrongEmotionName}
      </h2>
      <div className="mb-4 text-base text-text-primary">
        You also feel:
      </div>
      <div className="flex flex-col justify-center items-center w-full gap-4">
        <div className="flex flex-col justify-center items-start w-fit gap-4">
          {strongestEmotionIds.map((emotionId) => (
            <div key={emotionId} className="flex items-center gap-2 text-left">
              <Check size={16} className="text-primary" />
              {emotions.find((emotion) => emotion.id === emotionId)?.name ?? ''}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <PrimaryButton
          label="Start over"
          onClick={() => {
            dispatch({ type: 'clear_states' })
            dispatch({ type: 'clear_emotions' })
            dispatch({ type: 'clear_strong_emotions' })
            pushPage('welcome')
          }}
        />
      </div>
    </PageSection>
  )
}
