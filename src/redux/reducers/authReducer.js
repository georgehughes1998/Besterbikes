import {ACK_SIGN_IN, ACK_SIGN_OUT} from '../actions/types'

const INITIAL_STATE = {
    isSignedIn: false,
    user: null
};

//TODO: Decide if authReducer required when used with firebase
export default (state = INITIAL_STATE, action) => {
    switch (action.type){
        case ACK_SIGN_IN:
            return {...state, isSignedIn: true, user: action.payload};
        case ACK_SIGN_OUT:
            return INITIAL_STATE;
        default:
            return state
    }
}