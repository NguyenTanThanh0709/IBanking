import { combineReducers } from 'redux';
import login from './login.js'
import tuitionReducers from './tuitionReducers.js'

export default combineReducers({
    login,
    tuitionReducers 
});