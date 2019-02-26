import {combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form'

import uiReducer from "./uireducer";
import JsonReducer from "./jsonReducer";
import userReducer from "./userReducer";

export default combineReducers({
    ui: uiReducer,
    JSON: JsonReducer,
    user: userReducer,
    form: formReducer
})