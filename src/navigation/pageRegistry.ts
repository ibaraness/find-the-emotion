import { MyEmotionsPage } from '../pages/MyEmotionsPage'
import { MyStatePage } from '../pages/MyStatePage'
import { PausePage } from '../pages/PausePage'
import { RefinedEmotionsPage } from '../pages/RefinedEmotionsPage'
import { StrongestEmotionPage } from '../pages/StrongestEmotionPage'
import { SummaryPage } from '../pages/SummaryPage'
import { WelcomePage } from '../pages/WelcomePage'
import type { Screen } from '../state/types'
import type { PageComponent } from './types'

/**
 * Single place to register page ids → components. Keys must match {@link Screen}.
 */
export const pageRegistry = {
  welcome: WelcomePage,
  'my-state': MyStatePage,
  'my-emotions': MyEmotionsPage,
  'refined-emotions': RefinedEmotionsPage,
  'strongest-emotion': StrongestEmotionPage,
  pause: PausePage,
  summary: SummaryPage,
} as const satisfies Record<Screen, PageComponent>

export type PageId = keyof typeof pageRegistry

export const INITIAL_PAGE_ID: PageId = 'welcome'

export function isRegisteredPageId(id: string): id is PageId {
  return id in pageRegistry
}
