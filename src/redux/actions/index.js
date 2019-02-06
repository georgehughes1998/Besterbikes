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
