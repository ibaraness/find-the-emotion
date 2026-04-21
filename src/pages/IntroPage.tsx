import { Breadcrumb } from '@/components/Breadcrumb'
import { PageSection } from '@/components/PageSection'
import { ProcessFlow } from '@/components/ProcessFlow'
import { PrimaryButton } from '@/components/PrimaryButton'
import { usePageStack } from '@/navigation/PageStackContext'
import distortedHeartSmall from '@/assets/distorted-heart-small.webp'
import { Heart } from 'lucide-react'

/** Short intro before the state step — replace copy as you refine the flow. */
export function IntroPage() {
  const { pushPage } = usePageStack()

  return (
    <PageSection padding="narrow" textCenter>
      <Breadcrumb label="INTRO" marginBottomClassName='mb-4' />
      <div className="mx-auto h-[70px] w-[70px] mb-4">
        <img
          src={distortedHeartSmall}
          alt="Pastel cloud of color with a glowing heart at the center"
          width={70}
          height={70}
          className="block h-full w-full object-contain opacity-0 transition-opacity duration-300"
          onLoad={(e) => (e.currentTarget as HTMLImageElement).classList.remove("opacity-0")}
        />
      </div>
      <h1 className="mb-7 text-center text-[clamp(30px,8vw,48px)] font-normal leading-none tracking-tighter text-text-heading">
      Start with what you feel
      </h1>
      <p className="mb-12 text-base leading-[2rem] text-text-primary">
        You may feel many things at once. We'll go from a broad sense of what you feel to the emotions that feel most true.
      </p>
      <h2 className="text-center mb-7 text-[clamp(24px,6.5vw,35px)] font-normal leading-none tracking-tighter text-text-heading">
        How this works
      </h2>
      <div className="mb-8 px-4">
        <ProcessFlow
          steps={[
            { stepNumber: '1', label: 'Begin with a general feeling', icon: <Heart /> },
            { stepNumber: '2', label: 'Narrow it down step by step', icon: <Heart /> },
            { stepNumber: '3', label: 'Choose the emotions that feel strongest', icon: <Heart /> },
            { stepNumber: '4', label: 'Focus on what stands out most', icon: <Heart /> },
          ]}
        />
      </div>
      <ul className="mb-8 list-outside list-disc pl-12 pr-10 text-left">
        <li className="mb-4">We'll begin with a general feeling</li>
        <li className="mb-4">Narrow it down step by step</li>
        <li className="mb-4">Choose the emotions that feel strongest</li>
        <li className="mb-4">Focus on what stands out most</li>
      </ul>
      <p className="mb-12 text-base leading-[2rem] text-text-primary">
      This is about clarity, not solutions.
      </p>
      <div className="mt-8">
        <PrimaryButton label="Continue" onClick={() => pushPage('my-state')} />
      </div>
    </PageSection>
  )
}
