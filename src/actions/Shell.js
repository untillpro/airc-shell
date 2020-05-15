/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import { addShellErrorNotify } from 'actions/'
import { SHOW_AUTH_MODAL } from './UI';

export const INIT_STATE = 'init_state';
export const INIT_APP = 'init_application';
export const CHANGE_PATH = 'change_path';
export const IFRAME_LOADING_FINISH = 'iframe_loading_finish';
export const APPLY_MANIFEST = 'set_modules_manifest';
export const SELECT_SHELL_MODULE = 'select_shell_module';
export const SELECT_SHELL_VIEW = 'select_shell_view';
export const SELECT_PLUGIN = 'select_plugin';
export const SET_AUTH_TOKEN = 'set_auth_token';
export const DO_LOGOUT = 'do_logout';

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
    return (dispatch, getState) => {
        const state = getState();
        const { token, tokenValid } = state.shell;
        const { api } = state.context;

        if (api && token && tokenValid) {
            api.loadManifest(token)
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

export const selectPlugin = (application, view) => {
    return {
        type: SELECT_PLUGIN,
        payload: {
            application,
            view
        }
    };
}

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

/* // 
export const changePath = (path) => {
    return {
        type: CHANGE_PATH,
        payload: path
    };
};
*/

export const iframeLoadingFinished = () => {
    return {
        type: IFRAME_LOADING_FINISH
    };
};

export const checkAuthToken = (force = false) => {
    return (dispatch, getState) => {
        const state = getState();
        const { token, tokenExpired, tokenValid } = state.shell;

        if (token && tokenExpired) {
            const now = new Date().valueOf();

            if (now > tokenExpired) {
                const payload = {
                    tokenValid: false
                };

                if (force) {
                    payload.tokenExpired = null;
                    payload.token = null;

                    dispatch({
                        type: SET_AUTH_TOKEN,
                        payload
                    });
                } else {
                    dispatch({
                        type: SHOW_AUTH_MODAL
                    });
                }
            }
        } else if (token !== null || tokenExpired !== null || tokenValid === true) {
            dispatch({
                type: SET_AUTH_TOKEN,
                payload: {
                    token: null,
                    tokenValid: false,
                    tokenExpired: null
                }
            });
        }
    };
};

export const authUser = (token, ttl) => {
    if (token && typeof token === 'string' && ttl && ttl > 0) {
        return {
            type: SET_AUTH_TOKEN,
            payload: {
                token: token,
                tokenValid: true,
                tokenExpired: ttl
            }
        };
    }
};

export const doLogout = () => {
    return {
        type: DO_LOGOUT
    };
}