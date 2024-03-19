import { takeLatest, call, put } from 'redux-saga/effects';
import * as actions from '../actions';
import * as api from '../../api';


function* fetchLoginSaga(action) {
  try {
    const login = yield call(api.fetchLogin, action.payload);
    // console.log(login); 

    yield put(actions.login.loginSuccess(login.data));
  } catch (err) {
    console.error(err);
    yield put(actions.login.loginFailure(err));
  }
}


function* mySaga() {
  yield takeLatest(actions.login.loginRequest, fetchLoginSaga);
}
  

  
  export default mySaga;