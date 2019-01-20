import {combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form'

import uiReducer from "./uireducer";

export default combineReducers({
    ui: uiReducer,
    form: formReducer
})