import { ExampleNextPage } from '../pages/ExampleNextPage'
import { ExampleThirdPage } from '../pages/ExampleThirdPage'
import { MyEmotionsPage } from '../pages/MyEmotionsPage'
import { MyStatePage } from '../pages/MyStatePage'
import { WelcomePage } from '../pages/WelcomePage'
import type { PageComponent } from './types'

/**
 * Single place to register page ids → components. Add entries as you build flows.
 */
export const pageRegistry = {
  welcome: WelcomePage,
  'my-state': MyStatePage,
  'my-emotions': MyEmotionsPage,
  'example-next': ExampleNextPage,
  'example-third': ExampleThirdPage,
} as const satisfies Record<string, PageComponent>

export type PageId = keyof typeof pageRegistry

export const INITIAL_PAGE_ID: PageId = 'welcome'

export function isRegisteredPageId(id: string): id is PageId {
  return id in pageRegistry
}
