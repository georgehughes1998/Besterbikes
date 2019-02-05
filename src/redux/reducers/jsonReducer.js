import {LOAD_STATIONS, RETRIEVE_STATIONS} from "../actions/types";

const INITIAL_STATE = {
    stations: {}
};

export default (state = INITIAL_STATE, {type, payload}) => {
    switch (type) {
        case LOAD_STATIONS:
            if (!(payload === {})) {
                return {...state, stations: payload}
            }
            break;

        case RETRIEVE_STATIONS:
            return state;

        default:
            return state
    }
}