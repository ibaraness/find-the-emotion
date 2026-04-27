import type { ComponentType } from 'react'
import type { PageId } from './pageRegistry'

/** Props every page component receives; extend when you need shared data. */
export type PageViewProps = Record<string, never>

export type PageComponent = ComponentType<PageViewProps>

export type Direction = 1 | -1

export type PushPageOptions = {
  /**
   * When the `passIndex` for the new history row is not the current `activePass`
   * in this render (e.g. `add_pass` then `pushPage` in the same handler), pass the
   * index that should be stored in `sessionHistory`.
   */
  passIndex?: number
}

export type PageStackContextValue = {
  currentPageId: PageId
  /** Stable key for the visible stack path (depth + route). */
  stackKey: string
  canGoBack: boolean
  /** Last navigation direction: used by the shell for slide axis (1 forward, -1 back). */
  navigationDirection: Direction
  pushPage: (id: PageId, options?: PushPageOptions) => void
  popPage: () => void
  /**
   * Clear the in-app stack to a single “root” page and sync the browser history so
   * back/forward no longer re-enter the previous flow. Use after session reset
   * (e.g. “Start over”).
   */
  resetPageStackToRoot: () => void
}
