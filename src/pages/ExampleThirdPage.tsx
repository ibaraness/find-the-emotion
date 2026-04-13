import { PageSection } from '@/components/PageSection'
import { PrimaryButton } from '../components/PrimaryButton'
import { usePageStack } from '@/navigation/PageStackContext'

export function ExampleThirdPage() {
  const { popPage, canGoBack } = usePageStack()

  return (
    <PageSection>
      <h1 className="text-2xl font-semibold text-text-heading">Third screen</h1>
      <p className="mt-4 text-base text-text-primary">
        Another placeholder to verify multi-step back navigation.
      </p>
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
