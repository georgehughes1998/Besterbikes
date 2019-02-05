import {combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form'

import uiReducer from "./uireducer";
import JsonReducer from "./jsonReducer";

export default combineReducers({
    ui: uiReducer,
    JSON: JsonReducer,
    form: formReducer
})