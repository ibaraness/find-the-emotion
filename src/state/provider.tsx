import { useReducer, type ReactNode } from "react";
import type { FindEmotionState } from "./types";
import { findEmotionReducer } from "./reducer";
import { FindEmotionStateContext } from "./context";
import { FindEmotionDispatchContext } from "./context";

const initialState: FindEmotionState = {
  currentStep: "welcome",
  selectedStateIds: [],
  selectedEmotionIds: [],
  strongestEmotionIds: [],
  direction: 1,
};

export function FindEmotionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(findEmotionReducer, initialState);

  return (
    <FindEmotionStateContext.Provider value={state}>
      <FindEmotionDispatchContext.Provider value={dispatch}>
        {children}
      </FindEmotionDispatchContext.Provider>
    </FindEmotionStateContext.Provider>
  );
}