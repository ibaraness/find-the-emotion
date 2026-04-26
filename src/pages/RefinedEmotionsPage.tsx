import { useState } from 'react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { FlowResetConfirmDialog } from '@/components/FlowResetConfirmDialog'
import { MobileBottomAction } from '@/components/MobileBottomAction'
import { PageSection } from '@/components/PageSection'
import { PrimaryButton } from '@/components/PrimaryButton'
import { RankedEmotionSlot } from '@/components/RankedEmotionSlot'
import { AddEmotionRow } from '@/components/AddEmotionRow'
import { AnimatePresence, motion } from 'motion/react'
import { usePageStack } from '@/navigation/PageStackContext'
import {
  getActivePass,
  useFindEmotionDispatch,
  useFindEmotionState,
} from '@/state/context'
import { useMountedPass } from '@/state/useMountedPass'
import { useSessionPassGuard } from '@/state/useSessionPassGuard'
import { emotions } from '@/config/emotions'

/** Skeleton for refined emotions step — no chip list, ready for custom ranked UI. */
export function RefinedEmotionsPage() {
  const { pushPage } = usePageStack()
  const state = useFindEmotionState()
  const { activePass, passes } = state
  const passForEdit = getActivePass(state)
  const { displayedPass, mountedPassId } = useMountedPass()
  const { withPassContext } = useSessionPassGuard(mountedPassId)
  const { selectedEmotionIds, strongestEmotionIds } = displayedPass
  const dispatch = useFindEmotionDispatch()
  const [pendingAction, setPendingAction] = useState<{
    type: 'add' | 'remove'
    id: string
  } | null>(null)
  const hasFuturePasses = passes.length > 0 && activePass < passes.length - 1
  const hasStrongestPick = passForEdit.strongestSinglePickId != null
  const needsRefinedChangeWarning = hasFuturePasses || hasStrongestPick

  const getRank = (index: number): "1" | "2" | "3" => {
    if (index === 0) return "1";
    if (index === 1) return "2";
    return "3";
  };

  const slots: (string | null)[] = [0, 1, 2].map(
    i => strongestEmotionIds[i] ?? null
  );
  const availableEmotionIds = selectedEmotionIds.filter(
    (id) => !strongestEmotionIds.includes(id)
  );

  const requestAddStrongEmotion = (id: string) => {
    if (needsRefinedChangeWarning) {
      setPendingAction({ type: 'add', id })
      return
    }
    withPassContext(() => dispatch({ type: 'add_strong_emotion', id }))
  }

  const requestRemoveStrongEmotion = (id: string) => {
    if (needsRefinedChangeWarning) {
      setPendingAction({ type: 'remove', id })
      return
    }
    withPassContext(() => dispatch({ type: 'remove_strong_emotion', id }))
  }

  const onConfirmRefinedChange = () => {
    if (!pendingAction) return
    const action = pendingAction
    setPendingAction(null)
    withPassContext(() => {
      if (hasFuturePasses) {
        dispatch({ type: 'discard_later_passes' })
      }
      if (hasStrongestPick) {
        dispatch({ type: 'clear_strongest_single' })
      }
      if (action.type === 'add') {
        dispatch({ type: 'add_strong_emotion', id: action.id })
        return
      }
      dispatch({ type: 'remove_strong_emotion', id: action.id })
    })
  }

  return (
    <PageSection padding="narrow" textCenter className="pb-[180px] md:pb-20">
      <FlowResetConfirmDialog
        open={pendingAction != null}
        onCancel={() => setPendingAction(null)}
        onConfirm={onConfirmRefinedChange}
      />
      <Breadcrumb className='uppercase' label="What I’m really feeling" />
      <h1 className="mb-7 text-center text-[clamp(30px,8vw,48px)] font-normal leading-none tracking-tighter text-text-heading">
      Narrow it down
      </h1>
      <div className="mb-4 text-base text-text-primary">
      Choose up to 3 that feel strongest. No need to rank yet.
      </div>
      <div className="mt-8 px-5 flex flex-col gap-4">
        <AnimatePresence initial={false} mode="popLayout">
          {slots.map((emotionId, index) => (
            <motion.div
              key={emotionId ? `emotion-${emotionId}` : `empty-${index}`}
              layout
              initial={{ opacity: 0, y: 6, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.985 }}
              transition={{ type: 'spring', stiffness: 450, damping: 35, mass: 0.5 }}
            >
              <RankedEmotionSlot
                rank={getRank(index)}
                emotionLabel={emotionId ? emotions.find((emotion) => emotion.id === emotionId)?.name ?? '' : ''}
                showArrowButtons={false}
                onSelectEmotion={() => {}}
                onRemove={() => {
                  if (emotionId) requestRemoveStrongEmotion(emotionId)
                }}
                moveUp={() => {
                  if (emotionId) {
                    withPassContext(() =>
                      dispatch({ type: 'move_up_emotion', id: emotionId }),
                    )
                  }
                }}
                moveDown={() => {
                  if (emotionId) {
                    withPassContext(() =>
                      dispatch({ type: 'move_down_emotion', id: emotionId }),
                    )
                  }
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="mt-8 px-5 flex flex-col gap-4">
        <AnimatePresence initial={false} mode="popLayout">
          {availableEmotionIds.map((emotionId) => (
            <motion.div
              key={emotionId}
              layout
              initial={{ opacity: 0, y: 8, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.985 }}
              transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.55 }}
            >
              <AddEmotionRow
                label={emotions.find((emotion) => emotion.id === emotionId)?.name ?? ''}
                onAddition={() => requestAddStrongEmotion(emotionId)}
              />
            </motion.div>
          ))}
        </AnimatePresence>

      </div>
      <MobileBottomAction position="fixed">
        <PrimaryButton
          label="Continue"
          onClick={() => pushPage('strongest-emotion')}
          disabled={strongestEmotionIds.length === 0}
        />
      </MobileBottomAction>
      <div className="mt-8 hidden pb-20 md:block">
        <PrimaryButton
          label="Continue"
          onClick={() => pushPage('strongest-emotion')}
          disabled={strongestEmotionIds.length === 0}
        />
      </div>
    </PageSection>
  )
}
