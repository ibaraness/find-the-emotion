import type { HistoryEntry, Screen } from '@/state/types'
import { isObjectRecord } from '@/lib/typeGuards'
import { INITIAL_PAGE_ID, isRegisteredPageId, type PageId } from './pageRegistry'

/** Key on `history.state` holding `PageId[]` for browser back/forward sync. */
export const HISTORY_STACK_KEY = 'appStack' as const

/**
 * Key on `history.state` holding {@link HistoryEntry}[] in lockstep with
 * `appStack` (length = `appStack.length - 1` when the root is a single home page).
 */
export const SESSION_HISTORY_KEY = 'sessionHistory' as const

export function sanitizeStack(raw: unknown): PageId[] {
  if (!Array.isArray(raw)) return [INITIAL_PAGE_ID]
  const ids = raw.filter(
    (x): x is PageId => typeof x === 'string' && isRegisteredPageId(x),
  )
  if (ids.length === 0) return [INITIAL_PAGE_ID]
  return ids
}

export function mergeHistoryState(
  patch: Record<string, unknown>,
): Record<string, unknown> {
  const cur = window.history.state
  if (isObjectRecord(cur)) {
    return { ...(cur as Record<string, unknown>), ...patch }
  }
  return patch
}

export function readStackFromHistory(): PageId[] | undefined {
  const s = window.history.state
  if (!s || typeof s !== 'object' || Array.isArray(s)) return undefined
  const raw = (s as Record<string, unknown>)[HISTORY_STACK_KEY]
  return raw !== undefined ? sanitizeStack(raw) : undefined
}

function inferSessionFromStack(stack: PageId[]): HistoryEntry[] {
  if (stack.length <= 1) return []
  return stack.slice(1).map((screen) => ({
    passIndex: 0,
    screen: screen as Screen,
  }))
}

/**
 * `sessionHistory` is one entry per step past the first page; align length with
 * `stack` and validate entries; for legacy or corrupt state, best-effort infer.
 */
function sanitizeSessionHistory(raw: unknown, stack: PageId[]): HistoryEntry[] {
  const need = Math.max(0, stack.length - 1)
  if (need === 0) return []
  if (!Array.isArray(raw)) {
    return inferSessionFromStack(stack)
  }
  const out: HistoryEntry[] = []
  for (let i = 0; i < need; i++) {
    const item = raw[i]
    if (
      !item ||
      typeof item !== 'object' ||
      !('passIndex' in item) ||
      !('screen' in item)
    ) {
      return inferSessionFromStack(stack)
    }
    const passIndex = Number((item as { passIndex: unknown }).passIndex)
    const screen = (item as { screen: unknown }).screen
    if (
      !Number.isInteger(passIndex) ||
      typeof screen !== 'string' ||
      !isRegisteredPageId(screen)
    ) {
      return inferSessionFromStack(stack)
    }
    out.push({ passIndex, screen: screen as Screen })
  }
  return out
}

export function buildSessionTraceFromState(
  state: unknown,
  stack: PageId[],
): HistoryEntry[] {
  if (isObjectRecord(state)) {
    const raw = state[SESSION_HISTORY_KEY]
    return sanitizeSessionHistory(raw, stack)
  }
  return inferSessionFromStack(stack)
}
