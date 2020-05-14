/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import Logger from "base/classes/Logger";

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


export const setLanguage = (lang) => {
    Logger.debug(lang, 'Selected language', 'actions.UI.setLanguage');
    
    return {
        type: SET_LANGUAGE,
        payload: lang
    };
};

export const sendLaguageInitiated = () => {
    return {
        type: LAGUAGES_INITIATED
    }
}