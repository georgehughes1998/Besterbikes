import {CHANGE_SIDEBAR_STATUS} from "../actions/types";

const INITIAL_STATE = {
    sideBarVisible: false
};

export default (state = INITIAL_STATE, {type, payload}) => {
    switch (type) {
        case CHANGE_SIDEBAR_STATUS:
            if (payload === "Show") {
                return {...state, sideBarVisible: true}
            } else if (payload === "Hide") {
                return {...state, sideBarVisible: false}
            }
            break;

        default:
            return state
    }
}