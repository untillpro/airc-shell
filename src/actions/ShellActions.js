/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import API from 'classes/UshellApi.js';

import manifest from 'const/manifest';

import {
    INIT_APP,
    APPLY_MANIFEST,
    SELECT_SHELL_MODULE,
    SELECT_SHELL_VIEW,
    CHANGE_PATH,
    IFRAME_LOADING_FINISH
} from './types';

import {
    addShellErrorNotify
} from './NotifyActions'

export const initApp = () => {
    return (dispatch, getState) => {
        const state = getState();
        const { token, tokenExpired, tokenValid } = state.shell;
        const now = new Date().valueOf();

        let login = false;

        if ((!token || !tokenExpired) ||
            (tokenExpired <= now) ||
            (!tokenValid)) {
            login = true;
        }

        dispatch({
            type: INIT_APP,
            payload: {
                login
            }
        });
    };
};

export const loadManifest = () => {
    return {
        type: APPLY_MANIFEST,
        payload: manifest
    };
}

export const _loadManifest = () => {
    return (dispatch, getState) => {
        const state = getState();
        const { token, tokenValid } = state.shell;

        if (token && tokenValid) {
            API.loadManifest(token)
                .then((res) => {
                    if (res !== null) {
                        dispatch({
                            type: APPLY_MANIFEST,
                            payload: res
                        });
                    } else {
                        dispatch(addShellErrorNotify('Manifest not specified or wrong given'));
                    }
                    
                })
                .catch((e) => {
                    dispatch(addShellErrorNotify(e.message));
                });
        }
    };
}

export const selectModule = (code) => {

    return (dispatch, getState) => {
        const state = getState();
        const { cp, shell } = state;

        const { APPS } = cp;
        const { application } = shell;

        if (application === code) return;

        if (APPS && APPS[code] && application !== code) {
            const CPMod = APPS[code];

            dispatch({
                type: SELECT_SHELL_MODULE,
                payload: CPMod.load()
            }); 
        } else {
            dispatch(addShellErrorNotify('Selected module not presented in modules manifest'));
        }
    }
};

export const selectView = (code) => {

    return (dispatch, getState) => {
        const state = getState();
        const { cp, shell } = state;

        const { VIEWS } = cp;
        const { application, view } = shell;

        if (VIEWS && application && code && code !== view) {
            const CPView = VIEWS[application][code];

            if (CPView) {
                dispatch({
                    type: SELECT_SHELL_VIEW,
                    payload: CPView.load()
                });
            }
        }
    };
};

export const changePath = (path) => {
    return {
        type: CHANGE_PATH,
        payload: path
    };
};

export const iframeLoadingFinished = () => {
    return {
        type: IFRAME_LOADING_FINISH
    };
};

export const onModuleLoad = () => {
    return (dispatch, getState) => {
        const state = getState();
        const { view, application } = state.shell;
        const { VIEWS } = state.cp;

        if (VIEWS && VIEWS[application] && VIEWS[application][view] && VIEWS[application][view].invoke) {
            VIEWS[application][view].invoke();
        }


        dispatch({
            type: IFRAME_LOADING_FINISH
        });
    };
};