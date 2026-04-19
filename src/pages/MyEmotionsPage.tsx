import { Breadcrumb } from '@/components/Breadcrumb'
import { PageSection } from '@/components/PageSection'
import { PrimaryButton } from '@/components/PrimaryButton'
import { SelectableChip } from '@/components/SelectableChip'
import { emotions } from '@/config/emotions'
import { usePageStack } from '@/navigation/PageStackContext'
import { useFindEmotionDispatch, useFindEmotionState } from '@/state/context'

export function MyEmotionsPage() {
  const { pushPage } = usePageStack()
  const { selectedEmotionIds } = useFindEmotionState()
  const dispatch = useFindEmotionDispatch()

  return (
    <PageSection padding="narrow" textCenter>
      <Breadcrumb label="STEP 2: MY EMOTIONS" />
      <h1 className="mb-7 text-center text-[clamp(30px,8vw,48px)] font-normal leading-none tracking-tighter text-text-heading">
      What feels true for you right now?
      </h1>
      <p className="mb-4 text-base text-text-primary">You may be drawn to more than one. Choose what feels true. We’ll narrow it next.</p>
      <div className="grid w-full grid-cols-2 gap-x-3 gap-y-2 mt-2">
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
      <div className="mt-8">
        <PrimaryButton
          label="Continue"
          onClick={() => pushPage('refined-emotions')}
          disabled={selectedEmotionIds.length === 0}
        />
      </div>
    </PageSection>
  )
}
