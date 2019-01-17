import {CHANGE_SIDEBAR_STATUS} from './types'

export const changeSideBar = (tap) => {
        return {
            type: CHANGE_SIDEBAR_STATUS,
            payload: tap
        }
    }
;