import { createContext, useContext } from "react";
import type { Dispatch } from "react";
import type { FindEmotionAction, FindEmotionState } from "./types";

export const FindEmotionStateContext = createContext<FindEmotionState | null>(null);
export const FindEmotionDispatchContext = createContext<Dispatch<FindEmotionAction> | null>(null);

export function useFindEmotionState() {
  const context = useContext(FindEmotionStateContext);
  if (!context) {
    throw new Error("useFindEmotionState must be used within FindEmotionProvider");
  }
  return context;
}

export function useFindEmotionDispatch() {
  const context = useContext(FindEmotionDispatchContext);
  if (!context) {
    throw new Error("useFindEmotionDispatch must be used within FindEmotionProvider");
  }
  return context;
}