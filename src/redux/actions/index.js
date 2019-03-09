export const changeSideBar = (tap) => {
        return {
            type: 'CHANGE_SIDEBAR_STATUS',
            payload: tap
        }
    }
;

export const loadStations = (stations) => {
    return {
        type: 'LOAD_STATIONS',
        payload: stations
    }
};

export const loadTrips = (trips) => {
    return {
        type: 'LOAD_TRIPS',
        payload: trips
    }
};

export const loadOperators = (operators) => {
    return {
        type: 'LOAD_OPERATORS',
        payload: operators
    }
};

export const updateUserStatus = (status) => {
    return {
        type: 'UPDATE_USER_STATUS',
        payload: status
    }
};