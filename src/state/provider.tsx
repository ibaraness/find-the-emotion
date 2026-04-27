import { useEffect, useReducer, type ReactNode } from "react"
import type { FindEmotionState, Pass } from "./types"
import { findEmotionReducer } from "./reducer"
import { FindEmotionStateContext } from "./context"
import { FindEmotionDispatchContext } from "./context"
import { LogFindEmotionState } from "./dev/LogFindEmotionState"
import {
  readPersistedFindEmotionState,
  writePersistedFindEmotionState,
} from "./sessionStorageState"

const defaultPass: Pass = {
  id: "1",
  selectedStateIds: [],
  selectedEmotionIds: [],
  strongEmotionIds: [],
  dominantEmotionId: null,
}

const initialState: FindEmotionState = {
  passes: [defaultPass],
  activePass: 0,
  history: [],
  historyIndex: -1,
  direction: 1,
}

function getDefaultState(): FindEmotionState {
  return { ...initialState, passes: [{ ...defaultPass }] }
}

function initFindEmotionState(): FindEmotionState {
  return readPersistedFindEmotionState() ?? getDefaultState()
}

export function FindEmotionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    findEmotionReducer,
    undefined,
    initFindEmotionState,
  )

  useEffect(() => {
    writePersistedFindEmotionState(state)
  }, [state])

  return (
    <FindEmotionStateContext.Provider value={state}>
      <FindEmotionDispatchContext.Provider value={dispatch}>
        {import.meta.env.DEV ? <LogFindEmotionState /> : null}
        {children}
      </FindEmotionDispatchContext.Provider>
    </FindEmotionStateContext.Provider>
  )
}
