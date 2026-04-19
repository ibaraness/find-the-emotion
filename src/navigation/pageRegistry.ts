import { IntroPage } from '../pages/IntroPage'
import { MyEmotionsPage } from '../pages/MyEmotionsPage'
import { MyStatePage } from '../pages/MyStatePage'
import { RefinedEmotionsPage } from '../pages/RefinedEmotionsPage'
import { StrongestEmotionPage } from '../pages/StrongestEmotionPage'
import { SummaryPage } from '../pages/SummaryPage'
import { WelcomePage } from '../pages/WelcomePage'
import type { PageComponent } from './types'

/**
 * Single place to register page ids → components. Add entries as you build flows.
 */
export const pageRegistry = {
  welcome: WelcomePage,
  intro: IntroPage,
  'my-state': MyStatePage,
  'my-emotions': MyEmotionsPage,
  'refined-emotions': RefinedEmotionsPage,
  'strongest-emotion': StrongestEmotionPage,
  summary: SummaryPage,
} as const satisfies Record<string, PageComponent>

export type PageId = keyof typeof pageRegistry

export const INITIAL_PAGE_ID: PageId = 'welcome'

export function isRegisteredPageId(id: string): id is PageId {
  return id in pageRegistry
}
