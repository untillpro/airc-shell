/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

export const SET_CONTEXT_VALUE = 'set_context_value';
export const SET_REMOTE_API = 'set_remote_api';
export const SET_APPLICATION_PATH = 'set_application_path';

export const setContextValue = (name, value) => {
    return {
        type: SET_CONTEXT_VALUE,
        payload: {
            name,
            value
        }
    }
};

export const setApplicationPath = (path) => {
    return {
        type: SET_APPLICATION_PATH,
        payload: path
    };
};

export const setRemoteApi = (api) => {
    return {
        type: SET_REMOTE_API,
        payload: api
    };
}

export const onModuleLoad = (api) => {
    return {
        type: SET_REMOTE_API,
        payload: api
    };
};

