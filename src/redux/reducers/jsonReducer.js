const INITIAL_STATE = {
    stations: {},
    trips: [],
    operators: []
};

export default (state = INITIAL_STATE, {type, payload}) => {

    switch (type) {
        case 'LOAD_STATIONS':
            if (!(payload === {})) {
                return {...state, stations: payload}
            }
            break;

        case 'LOAD_TRIPS':
            if (!(payload === [])) {
                return {...state, trips: payload}
            }
            break;

        case 'LOAD_OPERATORS':
            if (!(payload === [])) {
                return {...state, operators: payload}
            }
            break;

        default:
            return state
    }
}