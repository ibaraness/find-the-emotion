import { PageSection } from '@/components/PageSection'
import { PrimaryButton } from '@/components/PrimaryButton'
import { SelectableChip } from '@/components/SelectableChip'
import { emotions } from '@/config/emotions'
import { usePageStack } from '@/navigation/PageStackContext'
import { useFindEmotionDispatch, useFindEmotionState } from '@/state/context'

/** Skeleton for the “my emotions” step — mirror of MyStatePage; replace copy as you build. */
export function MyEmotionsPage() {
  const { pushPage } = usePageStack()
  const { selectedEmotionIds } = useFindEmotionState()
  const dispatch = useFindEmotionDispatch()

  return (
    <PageSection padding="narrow" textCenter>
      <p className="mt-4 mb-10 text-center text-base text-text-primary">
        STEP 2: MY EMOTIONS
      </p>
      <h1 className="mb-7 text-center text-[48px] font-normal leading-none tracking-tighter text-text-heading">
      What feels closest right now?
      </h1>
      <p className="mb-4 text-base text-text-primary">Pick what feels closest</p>
      <div className="grid w-full grid-cols-2 gap-x-3 gap-y-2">
        {emotions.map((emotion) => (
          <div key={emotion.id} className="min-w-0">
            <SelectableChip
              label={emotion.name}
              selected={selectedEmotionIds.includes(emotion.id)}
              onChange={() => dispatch({ type: 'toggle_emotion', id: emotion.id })}
            />
          </div>
        ))}
      </div>
      <p className="mt-4 text-base text-text-primary">
        Page shell — add your UI here.
      </p>
      <div className="mt-8">
        <PrimaryButton
          label="Continue"
          onClick={() => pushPage('example-next')}
        />
      </div>
    </PageSection>
  )
}
