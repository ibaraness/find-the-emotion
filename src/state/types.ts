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
  /** Up to 3 strong emotion candidates selected in the refine step. */
  strongEmotionIds: string[]
  /** Final dominant emotion selected from `strongEmotionIds`. */
  dominantEmotionId: string | null
}

export type FindEmotionState = {
  /** Ordered passes; all flow data lives here per pass. */
  passes: Pass[]
  /** Index into `passes` for the pass being edited. */
  activePass: number
  /**
   * Mirrors the `sessionHistory` array in `window.history.state` (see
   * `PageStackContext`); updated whenever the app stack and browser state change.
   */
  history: HistoryEntry[]
  /** Current index into `history` (-1 when no entry is active). */
  historyIndex: number
  direction: 1 | -1
}


export type FindEmotionAction =
  | { type: "toggle_state"; id: string }
  | { type: "toggle_emotion"; id: string }
  | { type: "set_dominant_emotion"; id: string }
  | { type: "add_strong_emotion"; id: string }
  | { type: "move_up_emotion"; id: string }
  | { type: "move_down_emotion"; id: string }
  | { type: "remove_strong_emotion"; id: string }
  | { type: "clear_states" }
  | { type: "clear_emotions" }
  | { type: "clear_strong_emotions" }
  | { type: "clear_dominant_emotion" }
  | { type: "set_session_trace"; history: HistoryEntry[] }
  | { type: "reset_session_history" }
  | { type: "add_pass" }
  /** Removes passes after the active index; pass at index 0 is always kept. */
  | { type: "discard_later_passes" }
  /** Set active pass by index; invalid index is ignored (no-op). */
  | { type: "update_active_pass"; index: number }
