import type { PageId } from './pageRegistry'

/** Document title copy by route id. */
export const pageMetaTitleById: Record<PageId, string> = {
  welcome: 'Find the Emotion',
  'my-state': 'Find the Emotion · What feels closest right now?',
  'my-emotions': 'Find the Emotion · What feels true for you right now?',
  'refined-emotions': 'Find the Emotion · Which feels the strongest?',
  'strongest-emotion': 'Find the Emotion · Your strongest feeling right now',
  pause: 'Find the Emotion · Pause for a moment',
  summary: 'Find the Emotion · What feels strongest right now is',
}
