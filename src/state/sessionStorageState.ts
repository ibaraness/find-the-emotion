import { isObjectRecord } from '@/lib/typeGuards'
import { isRegisteredPageId } from '@/navigation/pageRegistry'
import type { FindEmotionState, HistoryEntry, Pass } from './types'

const STORAGE_KEY = 'find-the-emotion:session'
const VERSION = 1 as const

type PersistedShape = { v: typeof VERSION; state: FindEmotionState }

function isStringArray(x: unknown): x is string[] {
  return Array.isArray(x) && x.every((i) => typeof i === 'string')
}

function isPass(x: unknown): x is Pass {
  if (!isObjectRecord(x)) return false
  return (
    typeof x.id === 'string' &&
    isStringArray(x.selectedStateIds) &&
    isStringArray(x.selectedEmotionIds) &&
    isStringArray(x.strongEmotionIds) &&
    (x.dominantEmotionId === null || typeof x.dominantEmotionId === 'string')
  )
}

function isHistoryEntry(x: unknown): x is HistoryEntry {
  if (!isObjectRecord(x)) return false
  const { passIndex, screen } = x
  return (
    typeof passIndex === 'number' &&
    Number.isInteger(passIndex) &&
    passIndex >= 0 &&
    typeof screen === 'string' &&
    isRegisteredPageId(screen)
  )
}

function isFindEmotionState(x: unknown): x is FindEmotionState {
  if (!isObjectRecord(x)) return false
  if (!Array.isArray(x.passes) || x.passes.length < 1 || !x.passes.every(isPass)) {
    return false
  }
  if (typeof x.activePass !== 'number' || !Number.isInteger(x.activePass)) {
    return false
  }
  if (x.activePass < 0 || x.activePass >= x.passes.length) return false
  if (!Array.isArray(x.history) || !x.history.every(isHistoryEntry)) {
    return false
  }
  if (typeof x.historyIndex !== 'number' || !Number.isInteger(x.historyIndex)) {
    return false
  }
  if (x.historyIndex < -1 || x.historyIndex >= x.history.length) {
    return false
  }
  if (x.direction !== 1 && x.direction !== -1) return false
  return true
}

/**
 * Returns restored flow state for this tab, or `null` if missing/invalid/SSR.
 * Uses `sessionStorage` so a refresh keeps progress; the tab’s session is cleared when the tab closes.
 */
export function readPersistedFindEmotionState(): FindEmotionState | null {
  if (typeof window === 'undefined' || !window.sessionStorage) return null
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!isObjectRecord(parsed) || parsed.v !== VERSION) return null
    const candidate = (parsed as Partial<PersistedShape>).state
    if (!isFindEmotionState(candidate)) return null
    return candidate
  } catch {
    return null
  }
}

export function writePersistedFindEmotionState(state: FindEmotionState): void {
  if (typeof window === 'undefined' || !window.sessionStorage) return
  try {
    const payload: PersistedShape = { v: VERSION, state }
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // private mode, quota, or disabled storage
  }
}
