/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import API from 'classes/UshellApi.js';
import HTTP from 'const/HTTPCodes.js';

import {
    SET_AUTH_TOKEN,
    SHOW_AUTH_MODAL,
    HIDE_AUTH_MODAL,
    SHOW_FORGOT_MODAL,
    HIDE_FORGOT_MODAL,
    DO_LOGOUT
} from 'actions/types';

import {
    addShellErrorNotify,
    addShellSuccessNotify
} from './NotifyActions'

const TEST_TOKEN = "test.jwt.token";

//TODO remove this
// just for airs-router-2 testing
export const checkAuthToken = (force = false) => {
    return {
        type: SET_AUTH_TOKEN,
        payload: {
            token: TEST_TOKEN,
            tokenValid: true,
            tokenExpired: new Date().valueOf() + 86400000
        }
    };
}

export const _checkAuthToken = (force = false) => {
    return (dispatch, getState) => {
        const state = getState();
        const { token, tokenExpired } = state.shell;

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
                    dispatch(showAuthModal()); 
                }
            }
        } else {
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

//TODO remove this
// just for airs-router-2 testing
export const doAuth = (login, password, register = false) => {
    return { 
        type: SET_AUTH_TOKEN,
        payload: {
            token: TEST_TOKEN, 
            tokenValid: true,
            tokenExpired: new Date().valueOf() + 86400000
        }
    }
}

export const _doAuth = (login, password, register = false) => {
    return (dispatch) => {
        let action = null;

        if (register) {
            action = API.authorize(login, password, true);
        } else {
            action = API.authorize(login, password);
        }

        action.then((res) => {
                console.log('Auth res: ', res);

                if (res.token && res.exp) {
                    dispatch(addShellSuccessNotify('Authorization complete'));
                    
                    //const expDate = new Date().valueOf() + res.lifetime;
                    const expDate = res.exp * 1000;

                    dispatch({ 
                        type: SET_AUTH_TOKEN,
                        payload: {
                            token: res.token, 
                            tokenValid: true,
                            tokenExpired: expDate
                        }
                    });
                } else {
                    dispatch(addShellErrorNotify(res));
                }
            })
            .catch((e) => {
                dispatch(addShellErrorNotify(e));
            });
    }
};

export const doLogout = () => {
    return {
        type: DO_LOGOUT
    };
}

export const showAuthModal = () => {
    return {
        type: SHOW_AUTH_MODAL
    };
};

export const hideAuthModal = () => {
    return {
        type: HIDE_AUTH_MODAL
    };
};

export const showForgotModal = () => {
    return {
        type: SHOW_FORGOT_MODAL
    };
};

export const hideForgotModal = () => {
    return {
        type: HIDE_FORGOT_MODAL
    };
};