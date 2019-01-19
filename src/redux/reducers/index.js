import {combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form'

import uireducer from "./uireducer";

export default combineReducers({
    ui: uireducer,
    form: formReducer
})