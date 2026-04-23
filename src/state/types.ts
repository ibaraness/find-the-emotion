export type Step = 'welcome' | 'state' | 'emotion' | 'refine' | 'summary';

/**
 * Route ids — match keys in `pageRegistry` (kept in sync by convention).
 * When you add a page, add its id here and to the registry.
 */
export type Screen =
  | 'welcome'
  | 'intro'
  | 'my-state'
  | 'my-emotions'
  | 'refined-emotions'
  | 'strongest-emotion'
  | 'pause'
  | 'summary'

export type HistoryEntry = {
  passIndex: number
  screen: Screen
}

export type Pass = {
  id: string
  selectedStateIds: string[]
  selectedEmotionIds: string[]
  strongestEmotionIds: string[]
  /** The strongest pick among refined `strongestEmotionIds` (StrongestEmotionPage). */
  strongestSinglePickId: string | null
}

export type FindEmotionState = {
  currentStep: Step
  /** Ordered passes; all flow data lives here per pass. */
  passes: Pass[]
  /** Index into `passes` for the pass being edited. */
  activePass: number
  /** Logged as the user moves through route screens; see `NavigationHistoryBridge`. */
  history: HistoryEntry[]
  /** Current index into `history` (-1 when no entry is active). */
  historyIndex: number
  direction: 1 | -1
}


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
  | { type: "clear_strong_emotions" }
  | { type: "history_forward"; passIndex: number; screen: Screen }
  | { type: "history_back" }
  | { type: "reset_session_history" }
