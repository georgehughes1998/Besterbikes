import {combineReducers} from 'redux'
import authReducer from './authReducer'
//TODO: Add redux forms here

export default combineReducers({
    auth: authReducer
})