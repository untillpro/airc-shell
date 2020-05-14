/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

//action types

export const DROP_REGISTER_STEP = 'drop_register_step';
export const DROP_FORGOT_STEP = 'drop_forgot_step';
export const INIT_APP = 'init_app';
export const REGISTER_CHECK_CODE = 'register_check_code';
export const REGISTER_DONE = 'register_success';
export const FORGOT_CHANGE_PASSWORD = 'forgot_chage_password';
export const FORGOT_PASSWORD_CHANGED = 'forgot_password_changed';
export const SHOULD_CONFIRM_EMAIL = 'should_confirm_email';
export const AUTH_USER = 'auth_user';

// action creators

export const dropRegisterStep = () => {
    return {
        type: DROP_REGISTER_STEP,
    };
}

export const dropForgotStep = () => {
    return {
        type: DROP_FORGOT_STEP,
    };
}


export const registerConfirmCode = (email, token, ttl) => {
    return {
        type: REGISTER_CHECK_CODE,
        payload: {
            email,
            token,
            ttl
        }
    };
};

export const registrationDone = () => {
    return {
        type: REGISTER_DONE
    }
};

export const forgotChangePassword = (ttl) => {
    return {
        type: FORGOT_CHANGE_PASSWORD,
        payload: {
            ttl
        }
    }
}

export const resetPasswordSuccess = () => {
    return {
        type: FORGOT_PASSWORD_CHANGED
    };
};

export const userShouldConfirm = (email, token, ttl) => {
    return {
        type: SHOULD_CONFIRM_EMAIL,
        payload: {
            email,
            token,
            ttl
        }
    };
};