export type Step = 'welcome' | 'state' | 'emotion' | 'refine' | 'summary';

export type FindEmotionState = {
    currentStep: Step;
    selectedStateIds: string[];
    selectedEmotionIds: string[];
    direction: 1 | -1;
};

export type FindEmotionAction =
  | { type: "toggle_state"; id: string }
  | { type: "toggle_emotion"; id: string }
  | { type: "next_step"; nextStep: Step }
  | { type: "prev_step"; prevStep: Step }
  | { type: "clear_states" }
  | { type: "clear_emotions" };

