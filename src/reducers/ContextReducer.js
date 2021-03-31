/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import initState from 'utils/InitState';
import * as InitFuncs from './initiators/ContextStateInit';

import { 
    INIT_STATE, 
    SET_REMOTE_API,
    SET_APPLICATION_PATH
} from 'actions/';

const INITIAL_STATE = {
    api: null,
    remoteApi: null,
    applicationPath: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case INIT_STATE:
            return initState(state, InitFuncs);

        case SET_REMOTE_API:
            return {
                ...state,
                remoteApi: action.payload
            }
        case SET_APPLICATION_PATH:
            return {
                ...state,
                applicationPath: action.payload
            }

        default:
            return state;
    }
};