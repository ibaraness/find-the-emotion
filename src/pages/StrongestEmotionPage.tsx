import { Breadcrumb } from '@/components/Breadcrumb'
import { PageSection } from '@/components/PageSection'
import { PrimaryButton } from '@/components/PrimaryButton'
import { SelectableChip } from '@/components/SelectableChip'
import { emotions } from '@/config/emotions'
import { usePageStack } from '@/navigation/PageStackContext'
import { getActivePass, useFindEmotionDispatch, useFindEmotionState } from '@/state/context'

export function StrongestEmotionPage() {
  const { pushPage } = usePageStack()
  const { strongestEmotionIds, strongestSinglePickId } = getActivePass(
    useFindEmotionState(),
  )
  const dispatch = useFindEmotionDispatch()

  const effectivePick =
    strongestSinglePickId ??
    (strongestEmotionIds.length === 1 ? strongestEmotionIds[0] : null)

  return (
    <PageSection padding="narrow" textCenter>
      <Breadcrumb className='uppercase' label="What stands out most" />
      <h1 className="text-[clamp(30px,8vw,48px)] font-normal leading-none tracking-tighter text-center mb-10 text-text-heading">
      Which one stands out most right now?
      </h1>
      <p className="text-base text-text-primary mb-8">
        If one stands out a bit more, which one would it be?
      </p>
      <p className="text-base text-text-primary italic font-light mb-8">
        Take your time. Notice what stands out.
      </p>
      {strongestEmotionIds.map((emotionId) => {
        const emotion = emotions.find((e) => e.id === emotionId)
        if (!emotion) return null
        return (
          <div key={emotionId} className="px-4 py-2">
            <SelectableChip
              label={emotion.name}
              selected={effectivePick === emotionId}
              onChange={() =>
                dispatch({ type: 'set_strongest_single', id: emotionId })
              }
            />
          </div>
        )
      })}
      <div className="mt-8 pb-20">
        <PrimaryButton
          label="Continue"
          onClick={() => pushPage('pause')}
          disabled={effectivePick == null}
        />
      </div>
    </PageSection>
  )
}
