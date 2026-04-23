import { Breadcrumb } from '@/components/Breadcrumb'
import { PageSection } from '@/components/PageSection'
import { PrimaryButton } from '@/components/PrimaryButton'
import { emotions } from '@/config/emotions'
import { Check } from 'lucide-react'
import { usePageStack } from '@/navigation/PageStackContext'
import {
  getActivePass,
  useFindEmotionDispatch,
  useFindEmotionState,
} from '@/state/context'

/** Summary step scaffold — replace content as you build the final screen. */
export function SummaryPage() {
  const { pushPage } = usePageStack()
  const dispatch = useFindEmotionDispatch()
  const { strongestEmotionIds, strongestSinglePickId } = getActivePass(
    useFindEmotionState(),
  )
  const primaryEmotionId =
    strongestSinglePickId ??
    (strongestEmotionIds.length === 1 ? strongestEmotionIds[0] : null)
  const strongestEmotionName =
    emotions.find((emotion) => emotion.id === primaryEmotionId)?.name ?? ''
  const alsoEmotionIds = primaryEmotionId
    ? strongestEmotionIds.filter((id) => id !== primaryEmotionId)
    : []

  return (
    <PageSection padding="narrow" textCenter>
      <Breadcrumb label="STEP 6: SUMMARY" />
      <h1 className="mb-[clamp(30px,12vw,80px)] text-center text-[clamp(30px,8vw,48px)] font-normal leading-none tracking-tighter text-text-heading">
      What feels strongest right now is
      </h1>
      <h2 className='text-[clamp(40px,12vw,64px)] font-normal leading-none tracking-tighter text-text-heading mb-[clamp(30px,12vw,80px)]'>
        {strongestEmotionName}
      </h2>
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
                {emotions.find((emotion) => emotion.id === emotionId)?.name ?? ''}
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <div className="mt-12 pb-20">
        <PrimaryButton
          label="Start over"
          onClick={() => {
            dispatch({ type: 'reset_session_history' })
            pushPage('welcome')
          }}
        />
      </div>
    </PageSection>
  )
}
