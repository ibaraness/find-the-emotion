import type { FindEmotionAction, FindEmotionState } from './types'

export function findEmotionReducer( 
    state: FindEmotionState,
    action: FindEmotionAction
  ): FindEmotionState {
    switch (action.type) {
      case "toggle_state": {
        const selectedStateIds = [action.id];
        return { ...state, selectedStateIds };
      }
  
      case "toggle_emotion": {
        const exists = state.selectedEmotionIds.includes(action.id);
        const selectedEmotionIds = exists
          ? state.selectedEmotionIds.filter((id) => id !== action.id)
          : state.selectedEmotionIds.length >= 3
            ? state.selectedEmotionIds
            : [...state.selectedEmotionIds, action.id];
  
        return { ...state, selectedEmotionIds };
      }
  
      case "next_step":
        return {
          ...state,
          currentStep: action.nextStep,
          direction: 1,
        };
  
      case "prev_step":
        return {
          ...state,
          currentStep: action.prevStep,
          direction: -1,
        };
  
      case "clear_states":
        return { ...state, selectedStateIds: [] };
  
      case "clear_emotions":
        return { ...state, selectedEmotionIds: [] };
  
      default:
        return state;
    }
  }