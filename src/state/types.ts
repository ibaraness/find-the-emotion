export type Step = 'welcome' | 'state' | 'emotion' | 'refine' | 'summary';

export type FindEmotionState = {
    currentStep: Step;
    selectedStateIds: string[];
    selectedEmotionIds: string[];
    strongestEmotionIds: string[];
    /** The strongest pick among refined `strongestEmotionIds` (StrongestEmotionPage). */
    strongestSinglePickId: string | null;
    direction: 1 | -1;
};

export type FindEmotionAction =
  | { type: "toggle_state"; id: string }
  | { type: "toggle_emotion"; id: string }
  | { type: "set_strongest_single"; id: string }
  | { type: "add_strong_emotion"; id: string }
  | { type: "move_up_emotion"; id: string }
  | { type: "move_down_emotion"; id: string }
  | { type: "remove_strong_emotion"; id: string }
  | { type: "next_step"; nextStep: Step }
  | { type: "prev_step"; prevStep: Step }
  | { type: "clear_states" }
  | { type: "clear_emotions" }
  | { type: "clear_strong_emotions" };

