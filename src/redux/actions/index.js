import {ACK_SIGN_IN ,ACK_SIGN_OUT} from './types'

export const ackAuthChange = (user) => {
    if(user){
        return {
            type: ACK_SIGN_IN,
            payload: user
        }
    }else{
        return {
            type: ACK_SIGN_OUT,
        }
    }
};