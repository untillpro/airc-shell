/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import initState from 'utils/InitState';
//import Logger from 'base/classes/Logger';

import {
    INIT_STATE,
    DROP_REGISTER_STEP,
    DROP_FORGOT_STEP,
    INIT_APP,
    REGISTER_CHECK_CODE,
    REGISTER_DONE,
    FORGOT_CHANGE_PASSWORD,
    FORGOT_PASSWORD_CHANGED,
    SHOULD_CONFIRM_EMAIL
} from 'actions/';

const INITIAL_STATE = {
    authorized: false,

    state: 0,
    registerStep: 0,
    forgotStep: 0,
    
    init: false,
    confirmLen: 4,
    code: null,
    token: null,
    ttl: null,
    email: null,
    timeBeforeResend: 30,
};

export default (state = INITIAL_STATE, action) => {
    let newState;

    switch (action.type) {
        case INIT_STATE: 
            return initState(INITIAL_STATE, {});
        case INIT_APP:
            newState = {
                init: true
            };

            if (action.payload.state !== null && action.payload.state !== undefined) {
                newState.state = action.payload.state;
            }

            return newState;

        case DROP_REGISTER_STEP:
            return { 
                ...state, 
                registerStep: 0,
                code: null,
                token: null,
                ttl: null,
                email: null,
            };

        case DROP_FORGOT_STEP:
            return { 
                ...state, 
                forgotStep: 0,
                code: null,
                token: null,
                ttl: null,
                email: null,
            };

        case REGISTER_CHECK_CODE:
            return {
                ...state,
                registerStep: 1,
                token: action.payload.token,
                ttl: action.payload.ttl,
                email: action.payload.email
            };

        case REGISTER_DONE:
            return {
                ...state,
                registerStep: 2,
                token: null,
                ttl: null,
            };

        case FORGOT_CHANGE_PASSWORD:
            return {
                ...state,
                forgotStep: 1,
                ttl: action.payload.ttl
            };

        case FORGOT_PASSWORD_CHANGED:
            return {
                ...state,
                forgotStep: 2,
                ttl: null
            };

        case SHOULD_CONFIRM_EMAIL:
            return {
                ...state,
                forgotStep: 0,
                registerStep: 1,
                state: 1,
                ttl: action.payload.ttl,
                token: action.payload.token,
                email: action.payload.email
            };

        default:
            return state;
    }
}