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
          : state.selectedEmotionIds.length >= 7 
            ? state.selectedEmotionIds
            : [...state.selectedEmotionIds, action.id];
  
        return { ...state, selectedEmotionIds };
      }

      case "add_strong_emotion": {
        const exists = state.strongestEmotionIds.includes(action.id);
        const strongestEmotionIds = exists
          ? state.strongestEmotionIds
          : state.strongestEmotionIds.length >= 3
            ? state.strongestEmotionIds
            : [...state.strongestEmotionIds, action.id];

        return { ...state, strongestEmotionIds };
      }

      case "remove_strong_emotion": {
        const strongestEmotionIds = state.strongestEmotionIds.filter(
          (id) => id !== action.id
        );
        return { ...state, strongestEmotionIds };
      }

      case "move_up_emotion": {
        if (state.strongestEmotionIds.length <= 1) return state;

        const index = state.strongestEmotionIds.indexOf(action.id);
        if (index === -1) return state;

        const strongestEmotionIds = [...state.strongestEmotionIds];
        const targetIndex =
          index === 0 ? strongestEmotionIds.length - 1 : index - 1;

        [strongestEmotionIds[index], strongestEmotionIds[targetIndex]] = [
          strongestEmotionIds[targetIndex],
          strongestEmotionIds[index],
        ];

        return { ...state, strongestEmotionIds };
      }

      case "move_down_emotion": {
        if (state.strongestEmotionIds.length <= 1) return state;

        const index = state.strongestEmotionIds.indexOf(action.id);
        if (index === -1) return state;

        const strongestEmotionIds = [...state.strongestEmotionIds];
        const targetIndex =
          index === strongestEmotionIds.length - 1 ? 0 : index + 1;

        [strongestEmotionIds[index], strongestEmotionIds[targetIndex]] = [
          strongestEmotionIds[targetIndex],
          strongestEmotionIds[index],
        ];

        return { ...state, strongestEmotionIds };
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
  
      case "clear_strong_emotions":
        return { ...state, strongestEmotionIds: [] };
  
      default:
        return state;
    }
  }