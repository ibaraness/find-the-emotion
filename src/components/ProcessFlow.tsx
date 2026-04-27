import { ChevronDown } from 'lucide-react'
import { ProcessStep, type ProcessStepProps } from '@/components/ProcessStep'

export type ProcessFlowProps = {
  steps: ProcessStepProps[]
  className?: string
}

/**
 * Vertical flow of ProcessStep rows with centered chevrons between each pair.
 */
export function ProcessFlow({ steps, className = '' }: ProcessFlowProps) {
  return (
    <div className={`w-full ${className}`}>
      {steps.map((step, index) => (
        <div key={index}>
          <ProcessStep {...step} />
          {index < steps.length - 1 ? (
            <div className="my-2 flex w-full justify-center">
              <ChevronDown size={48} className="text-primary" aria-hidden="true" />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}
