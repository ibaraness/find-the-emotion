import { Breadcrumb } from '@/components/Breadcrumb'
import { FlowResetConfirmDialog } from '@/components/FlowResetConfirmDialog'
import { MobileBottomAction } from '@/components/MobileBottomAction'
import { PageSection } from '@/components/PageSection'
import { PrimaryButton } from '@/components/PrimaryButton'
import { SelectableChip } from '@/components/SelectableChip'
import { emotions } from '@/config/emotions'
import { usePageStack } from '@/navigation/PageStackContext'
import {
  useFindEmotionDispatch,
  useFindEmotionState,
} from '@/state/context'
import {
  selectHasAnyStrongEmotions,
  selectHasFuturePasses,
  selectHasStrongestSinglePick,
} from '@/state/selectors'
import { useMountedPass } from '@/state/useMountedPass'
import { useSessionPassGuard } from '@/state/useSessionPassGuard'
import { useFlowResetConfirm } from '@/state/useFlowResetConfirm'
import type { Pass } from '@/state/types'

function primaryStrongestEmotionName(pass: Pass): string {
  const id =
    pass.dominantEmotionId ??
    (pass.strongEmotionIds.length === 1
      ? pass.strongEmotionIds[0]
      : null) ??
    pass.strongEmotionIds[0] ??
    null
  if (!id) return ''
  return emotions.find((e) => e.id === id)?.name ?? ''
}

export function MyEmotionsPage() {
  const { pushPage } = usePageStack()
  const state = useFindEmotionState()
  const { passes } = state
  const hasFuturePasses = selectHasFuturePasses(state)
  const hasRefineOrStrongestWork =
    selectHasAnyStrongEmotions(state) || selectHasStrongestSinglePick(state)
  const shouldConfirm = hasFuturePasses || hasRefineOrStrongestWork
  const resetOptionsOnConfirm = {
    discardFuturePasses: hasFuturePasses,
    clearStrongEmotions: hasRefineOrStrongestWork,
  }
  const { displayedPass, displayedPassIndex, mountedPassId } = useMountedPass()
  const { withPassContext } = useSessionPassGuard(mountedPassId)
  const dispatch = useFindEmotionDispatch()
  const {
    isDialogOpen,
    handleActionRequest,
    onCancel,
    onConfirm,
  } = useFlowResetConfirm({
    dispatch,
    shouldConfirm,
    resetOptionsOnConfirm,
  })

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

  const requestToggleEmotion = (id: string) => {
    handleActionRequest(() =>
      withPassContext(() => dispatch({ type: 'toggle_emotion', id })),
    )
  }

  return (
    <PageSection padding="narrow" textCenter className="pb-[180px] md:pb-20">
      <FlowResetConfirmDialog
        open={isDialogOpen}
        onCancel={onCancel}
        onConfirm={() => withPassContext(onConfirm)}
      />
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
              onChange={() => requestToggleEmotion(emotion.id)}
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
