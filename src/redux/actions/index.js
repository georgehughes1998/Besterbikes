import {CHANGE_SIDEBAR_STATUS, LOAD_STATIONS, RETRIEVE_STATIONS} from './types'

export const changeSideBar = (tap) => {
        return {
            type: CHANGE_SIDEBAR_STATUS,
            payload: tap
        }
    }
;

export const loadStations = (stations) => {
    return {
        type: LOAD_STATIONS,
        payload: stations
    }
};

export const retrieveStations = () => {
    return {
        type: RETRIEVE_STATIONS
    }
}