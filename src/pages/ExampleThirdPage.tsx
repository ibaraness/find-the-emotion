import { PageSection } from '@/components/PageSection'
import { PrimaryButton } from '../components/PrimaryButton'
import { usePageStack } from '@/navigation/PageStackContext'
import { RankedEmotionSlot } from '@/components/RankedEmotionSlot'
import { AddEmotionRow } from '@/components/AddEmotionRow'

export function ExampleThirdPage() {
  const { popPage, canGoBack } = usePageStack()

  return (
    <PageSection>
      <h1 className="text-2xl font-semibold text-text-heading">Third screen</h1>
      <p className="mt-4 text-base text-text-primary">
        Another placeholder to verify multi-step back navigation.
      </p>
      <div className="mt-8 px-5 flex flex-col gap-4">
        <RankedEmotionSlot rank="1" emotionLabel="Emotion 1" onSelectEmotion={() => {}} onRemove={() => {}} moveUp={() => {}} moveDown={() => {}} />
        <RankedEmotionSlot rank="2" emotionLabel="" onSelectEmotion={() => {}} onRemove={() => {}} moveUp={() => {}} moveDown={() => {}} />
        <RankedEmotionSlot rank="2" emotionLabel="" onSelectEmotion={() => {}} onRemove={() => {}} moveUp={() => {}} moveDown={() => {}} />
      </div>
      
      <div className="mt-8 px-5">
        <AddEmotionRow label="Powerlessness" onAddition={() => {}} />
      </div>

      <div className="mt-8">
        <PrimaryButton
          label="Go back"
          onClick={() => popPage()}
          disabled={!canGoBack}
        />
      </div>
    </PageSection>
  )
}
