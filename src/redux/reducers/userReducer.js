const INITIAL_STATE = {
    status: {},
    webpages: {},
    currentUser: {}
};

export default (state = INITIAL_STATE, {type, payload}) => {

    switch (type) {

        case 'UPDATE_USER_STATUS':
            if (!(payload === {})) {
                return {...state, status: payload}
            }
            break;

        case 'LOAD_WEB_PAGES':
            if (!(payload === {})) {
                return {...state, webpages: payload}
            }
            break;

        case 'LOAD_CURRENT_USER':
            if (!(payload === {})) {
                return {...state, currentUser: payload}
            }
            break;

        default:
            return state
    }
}

