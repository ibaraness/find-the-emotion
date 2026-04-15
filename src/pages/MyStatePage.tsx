
import { PageSection } from '@/components/PageSection'
import { PrimaryButton } from '@/components/PrimaryButton'
import { SelectableChip } from '@/components/SelectableChip'
import { usePageStack } from '@/navigation/PageStackContext'
import { states } from '@/config/states'
import { useFindEmotionDispatch, useFindEmotionState } from '@/state/context'

/** Skeleton for the “my state” step — replace content as you build the flow. */
export function MyStatePage() {
  const { pushPage } = usePageStack()
  const { selectedStateIds } = useFindEmotionState();
  const dispatch = useFindEmotionDispatch();

  return (
    <PageSection padding="narrow" textCenter>
      <div className="mt-4 mb-10 text-center text-[clamp(12px,3.26vw,15px)] text-text-primary">
        STEP 1: MY STATE
      </div>
      <h1 className="text-[clamp(30px,8vw,48px)] font-normal leading-none tracking-tighter text-center mb-7 text-text-heading">
        How do you feel right now?
      </h1>
      <p className="text-base text-text-primary mb-4">
        Pick what feels closest
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
      <p className="mt-4 text-base text-text-primary">
        Page shell — add your UI here.
      </p>
      <div className="mt-8">
        <PrimaryButton
          label="Continue"
          onClick={() => pushPage('my-emotions')}
          disabled={selectedStateIds.length === 0}
        />
      </div>
    </PageSection>
  )
}
