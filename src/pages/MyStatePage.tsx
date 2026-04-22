import { Breadcrumb } from '@/components/Breadcrumb'
import { MobileBottomAction } from '@/components/MobileBottomAction'
import { PageSection } from '@/components/PageSection'
import { PrimaryButton } from '@/components/PrimaryButton'
import { SelectableChip } from '@/components/SelectableChip'
import { usePageStack } from '@/navigation/PageStackContext'
import { states } from '@/config/states'
import { useFindEmotionDispatch, useFindEmotionState } from '@/state/context'

export function MyStatePage() {
  const { pushPage } = usePageStack()
  const { selectedStateIds } = useFindEmotionState();
  const dispatch = useFindEmotionDispatch();

  return (
    <PageSection padding="narrow" textCenter className="pb-[180px] md:pb-20">
      <Breadcrumb label="STEP 1: MY STATE" />
      <h1 className="text-[clamp(30px,8vw,48px)] font-normal leading-none tracking-tighter text-center mb-7 text-text-heading">
      What are you feeling right now?
      </h1>
      <p className="text-base text-text-primary mb-4">
      You may feel more than one thing. Start broad. We’ll narrow it next.
      </p>
      {states.map((state) => (
        <div key={state.id} className="px-4 py-2">
          <SelectableChip
            label={state.name}
            selected={selectedStateIds.includes(state.id)}
            onChange={() => dispatch({ type: 'toggle_state', id: state.id })}
          />
        </div>
      ))}
      <MobileBottomAction position="fixed">
        <PrimaryButton
          label="Continue"
          onClick={() => pushPage('my-emotions')}
          disabled={selectedStateIds.length === 0}
        />
      </MobileBottomAction>
      <div className="mt-8 hidden pb-20 md:block">
        <PrimaryButton
          label="Continue"
          onClick={() => pushPage('my-emotions')}
          disabled={selectedStateIds.length === 0}
        />
      </div>
    </PageSection>
  )
}
