/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import _ from 'lodash';
import Logger from "base/classes/Logger";
import i18next from 'i18next';

export const SHOW_AUTH_MODAL = 'toggle_auth_modal';
export const HIDE_AUTH_MODAL = 'hide_auth_modal';
export const SHOW_FORGOT_MODAL = 'toggle_forgot_modal';
export const HIDE_FORGOT_MODAL = 'hide_forgot_modal';
export const SET_LANGUAGE = 'set_language';
export const LAGUAGES_INITIATED = 'languages_initiated';

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


export const setLanguage = (code) => {
    Logger.debug(code, 'Selected language', 'actions.UI.setLanguage');

    return (dispatch, getState) => {
        const state = getState();

        const { availableLangs } = state.ui;
        const { remoteApi } = state.context;

        const lang = _.isPlainObject(availableLangs) ? availableLangs[code] : null;

        if (lang) {
            if (remoteApi && remoteApi.setLanguage && typeof remoteApi.setLanguage === 'function') {
                remoteApi.setLanguage(lang.hex);
            }

            i18next.changeLanguage(code, () => {
                dispatch({
                    type: SET_LANGUAGE,
                    payload: code
                });
            });
        } else {
            console.error(`Atempt to select not available language with code "${code}"`);
        }
    };

};

export const sendLanguageInitiated = (availableLanguages) => {
    return {
        payload: availableLanguages,
        type: LAGUAGES_INITIATED
    }
}