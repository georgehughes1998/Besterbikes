const INITIAL_STATE = {
    status: {}
};

export default (state = INITIAL_STATE, {type, payload}) => {

    switch (type) {

        case 'UPDATE_USER_STATUS':
            if (!(payload === {})) {
                return {...state, status: payload}
            }
            break;

        default:
            return state
    }
}

