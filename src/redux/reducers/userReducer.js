const INITIAL_STATE = {
    status: {},
    webpages: {}
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

        default:
            return state
    }
}

