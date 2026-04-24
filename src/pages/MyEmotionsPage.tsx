import { Breadcrumb } from '@/components/Breadcrumb'
import { MobileBottomAction } from '@/components/MobileBottomAction'
import { PageSection } from '@/components/PageSection'
import { PrimaryButton } from '@/components/PrimaryButton'
import { SelectableChip } from '@/components/SelectableChip'
import { emotions } from '@/config/emotions'
import { usePageStack } from '@/navigation/PageStackContext'
import { useFindEmotionDispatch } from '@/state/context'
import { useMountedPass } from '@/state/useMountedPass'
import type { Pass } from '@/state/types'

function primaryStrongestEmotionName(pass: Pass): string {
  const id =
    pass.strongestSinglePickId ??
    (pass.strongestEmotionIds.length === 1
      ? pass.strongestEmotionIds[0]
      : null) ??
    pass.strongestEmotionIds[0] ??
    null
  if (!id) return ''
  return emotions.find((e) => e.id === id)?.name ?? ''
}

export function MyEmotionsPage() {
  const { pushPage } = usePageStack()
  const { displayedPass, displayedPassIndex, state } = useMountedPass()
  const { passes } = state
  const dispatch = useFindEmotionDispatch()

  const { selectedEmotionIds } = displayedPass
  const isFollowUpPass = displayedPassIndex > 0
  const previousPass = isFollowUpPass ? passes[displayedPassIndex - 1] : undefined
  const previousPassName = previousPass
    ? primaryStrongestEmotionName(previousPass)
    : ''
  const heading =
    isFollowUpPass && previousPassName
      ? `If you rewind a bit… what was there before ${previousPassName}?`
      : 'What feels true for you right now?'

  return (
    <PageSection padding="narrow" textCenter className="pb-[180px] md:pb-20">
      <Breadcrumb className='uppercase' label="What feels true right now" />
      <h1 className="mb-7 text-center text-[clamp(30px,8vw,48px)] font-normal leading-none tracking-tighter text-text-heading">
        {heading}
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
      <MobileBottomAction position="fixed">
        <PrimaryButton
          label="Continue"
          onClick={() => pushPage('refined-emotions')}
          disabled={selectedEmotionIds.length === 0}
        />
      </MobileBottomAction>
      <div className="mt-8 hidden pb-20 md:block">
        <PrimaryButton
          label="Continue"
          onClick={() => pushPage('refined-emotions')}
          disabled={selectedEmotionIds.length === 0}
        />
      </div>
    </PageSection>
  )
}
