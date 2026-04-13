import type { ComponentType } from 'react'

/** Props every page component receives; extend when you need shared data. */
export type PageViewProps = Record<string, never>

export type PageComponent = ComponentType<PageViewProps>
