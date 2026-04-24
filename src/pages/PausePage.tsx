import { Breadcrumb } from '@/components/Breadcrumb'
import { MobileBottomAction } from '@/components/MobileBottomAction'
import { PageSection } from '@/components/PageSection'
import { PrimaryButton } from '@/components/PrimaryButton'
import { usePageStack } from '@/navigation/PageStackContext'
import distortedHeartSmall from '@/assets/distorted-heart-small.webp'
import {
  useFindEmotionDispatch,
} from '@/state/context'
import { useMountedPass } from '@/state/useMountedPass'
import { emotions } from '@/config/emotions'
import { Check } from 'lucide-react'
import { SecondaryButton } from '@/components/SecondaryButton'
import { flushSync } from 'react-dom'
export function PausePage() {
  const { pushPage } = usePageStack()
  const dispatch = useFindEmotionDispatch()
  const { displayedPass, state } = useMountedPass()
  const { passes } = state
  const { strongestEmotionIds, strongestSinglePickId } = displayedPass
  const primaryEmotionId =
    strongestSinglePickId ??
    (strongestEmotionIds.length === 1 ? strongestEmotionIds[0] : null)
  const strongestEmotionName =
    emotions.find((emotion) => emotion.id === primaryEmotionId)?.name ?? ''

  const onMoreHere = () => {
    const newPassIndex = passes.length
    flushSync(() => {
      dispatch({ type: 'add_pass' })
    })
    pushPage('my-emotions', { passIndex: newPassIndex })
  }

  return (
    <PageSection padding="narrow" textCenter className="pb-[380px] md:pb-20">
      <Breadcrumb className='uppercase' label="Pause for a moment..." marginBottomClassName='mb-4' />
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
        Pause for a moment before moving on
      </h1>
      <p className="mb-12 text-base leading-[2rem] text-text-primary">
      Does <span className="font-bold uppercase">{strongestEmotionName}</span> feel complete, or is there something more?
      </p>
      <div className="flex flex-col justify-center items-center w-full gap-4">
          <div className="flex flex-col justify-center items-start w-[clamp(200px,77vw,400px)] md:w-fit gap-4">

              <div className="flex items-center gap-2 text-left">
                <Check size={16} className="shrink-0 text-primary" />
                If it feels complete, continue to the summary.
              </div>
              <div className="flex items-center gap-2 text-left">
                <Check size={16} className="shrink-0 text-primary" />
                If not, gently look back and notice whether there was another feeling that came before it
              </div>
          </div>
        </div>

      <MobileBottomAction position="fixed">
        <div className="mb-4"><PrimaryButton label="Continue to summary" onClick={() => pushPage('summary')} /></div>
        <div className="mb-4"><SecondaryButton label="I think there’s more here" onClick={onMoreHere} /></div>
      </MobileBottomAction>
      <div className="mt-8 hidden pb-20 pt-8 md:block">
        <div className="mb-4"><PrimaryButton label="Continue to summary" onClick={() => pushPage('summary')} /></div>
        <div className="mb-4"><SecondaryButton label="I think there’s more here" onClick={onMoreHere} /></div>
      </div>
    </PageSection>
  )
}
