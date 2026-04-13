import { PageSection } from '@/components/PageSection'
import { PrimaryButton } from '../components/PrimaryButton'
import heartWelcome from '@/assets/heart-welcome2.webp'
import { usePageStack } from '@/navigation/PageStackContext'

export function WelcomePage() {
  const { pushPage } = usePageStack()

  return (
    <PageSection>
      <img
        src={heartWelcome}
        alt="Pastel cloud of color with a glowing heart at the center"
        className="mx-auto block h-auto w-full max-w-[270px]"
      />
      <h1 className="mt-2 text-center text-[64px] capitalize font-normal leading-tight tracking-[-4.8px] text-text-heading">
        Find the emotion
      </h1>
      <p className="mt-4 px-6 text-center text-base text-text-primary">
      A simple way to find clarity in how you feel right now
      </p>
      

      <div className="mt-8">
        <PrimaryButton
          label="Start"
          onClick={() => pushPage('my-state')}
        />
      </div>
    </PageSection>
  )
}
