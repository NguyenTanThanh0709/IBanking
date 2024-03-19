import { INIT_STATE } from '../../constant';
import { login, getType } from '../actions';


export default function loginReducers(state = INIT_STATE.login, action) {

  switch (action.type) {
    case getType(login.set):
      return {
        ...state,
        isLoading: false,
        isAuthenticated: 1,
        data: action.payload || null, // Ensure action.payload is not undefined
      };
    case getType(login.loginRequest):
      return {
        ...state,
        isLoading: true,
      };
    case getType(login.loginSuccess):
      return {
        ...state,
        isLoading: false,
        isAuthenticated: 1,
        data: action.payload || null, // Ensure action.payload is not undefined
      };
    case getType(login.loginFailure):
      return {
        ...state,
        isAuthenticated: 2,
        isLoading: false,
      };
      case getType(login.logout):
      return {
        ...state,
        isAuthenticated: 0,
        isLoading: false,
        data:  null,
      };
    default:
      return state;
  }

        
}