import { PageSection } from '@/components/PageSection'
import { PrimaryButton } from '../components/PrimaryButton'
import heartWelcome from '@/assets/heart-welcome2.webp'
import { usePageStack } from '@/navigation/PageStackContext'
import { useFindEmotionDispatch } from '@/state/context'

export function WelcomePage() {
  const { pushPage } = usePageStack()
  const dispatch = useFindEmotionDispatch()

  return (
    <PageSection>
      <div className="mx-auto h-[270px] w-[270px]">
        <img
          src={heartWelcome}
          alt="Pastel cloud of color with a glowing heart at the center"
          width={270}
          height={270}
          className="block h-full w-full object-contain opacity-0 transition-opacity duration-300"
          onLoad={(e) => (e.currentTarget as HTMLImageElement).classList.remove("opacity-0")}
        />
      </div>
      <h1 className="mt-2 text-center text-[64px] capitalize font-normal leading-tight tracking-[-4.8px] text-text-heading">
        Find the emotion
      </h1>
      <p className="mt-4 px-6 text-center text-base text-text-primary">
      A simple way to find clarity in what you feel right now
      </p>
      

      <div className="mt-8">
        <PrimaryButton
          label="Start"
          onClick={() => {
            dispatch({ type: 'clear_states' })
            dispatch({ type: 'clear_emotions' })
            dispatch({ type: 'clear_strong_emotions' })
            pushPage('my-state')
          }}
        />
      </div>
    </PageSection>
  )
}
