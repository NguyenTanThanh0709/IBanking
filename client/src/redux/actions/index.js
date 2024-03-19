import { createActions, createAction } from 'redux-actions';

export const getType = (reduxAction) => {
  return reduxAction().type;
};

export const login = createActions({
    loginRequest: (payload) => payload,
    loginSuccess: (payload) => payload,
    loginFailure: (err) => err,
    logout: () => {},
    set: (payload) => payload,
  });

export const tuition = createActions({
  fetchTuitionRequest: (payload) => payload,
  fetchTuitionSuccess: (payload) => payload,
  fetchTuitionFailure: (error) => error,
});