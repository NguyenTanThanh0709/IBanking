import { INIT_STATE } from '../../constant';
import { tuition, getType } from '../actions';


export default function tuitionReducers(state = INIT_STATE.tuition, action) {

  switch (action.type) {
    case getType(tuition.fetchTuitionRequest):
      return {
        ...state,
        isLoading: true,
      };
    case getType(tuition.fetchTuitionSuccess):
      return {
        ...state,
        isLoading: false,
        data: action.payload || null, // Ensure action.payload is not undefined
      };
    case getType(tuition.fetchTuitionFailure):
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }

        
}