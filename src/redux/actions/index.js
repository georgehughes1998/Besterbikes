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

export const loadTasks = (tasks) => {
    return {
        type: 'LOAD_TASKS',
        payload: tasks
    }
};

export const loadOperators = (operators) => {
    return {
        type: 'LOAD_OPERATORS',
        payload: operators
    }
};

export const loadWebpages = (webpages) => {
    return {
        type: 'LOAD_WEB_PAGES',
        payload: webpages
    }
};

export const loadCustomers = (customers) => {
    return {
        type: 'LOAD_CUSTOMERS',
        payload: customers
    }
};

export const updateUserStatus = (status) => {
    return {
        type: 'UPDATE_USER_STATUS',
        payload: status
    }
};

export const loadCurrentUser = (user) => {
    return {
        type: 'LOAD_CURRENT_USER',
        payload: user
    }
};