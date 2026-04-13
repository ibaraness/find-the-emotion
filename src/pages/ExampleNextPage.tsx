import { PageSection } from '@/components/PageSection'
import { PrimaryButton } from '../components/PrimaryButton'
import { usePageStack } from '@/navigation/PageStackContext'

/** Demo page: replace with a real screen later; shows back + forward hooks. */
export function ExampleNextPage() {
  const { popPage, pushPage, canGoBack } = usePageStack()

  return (
    <PageSection>
      <h1 className="text-2xl font-semibold text-text-heading">Next section</h1>
      <p className="mt-4 text-base text-text-primary">
        This is a placeholder page. The shell slides forward and back; backgrounds
        stay transparent so the app background shows through.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <PrimaryButton
          label="Go back"
          onClick={() => popPage()}
          disabled={!canGoBack}
        />
        <PrimaryButton
          label="Open another (demo stack)"
          onClick={() => pushPage('example-third')}
        />
      </div>
    </PageSection>
  )
}
