/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import {
    ERROR,
    INFO,
    WARNING,
    SUCCESS
} from 'const/notifies';

export const ADD_SHELL_NOTIFY_MESSAGE = 'add_shell_notify_message';

export const addShellErrorNotify = (text = '', description = '', lifetime = 5, hideclose = false) => {
    return addShellNotifyMessage(String(text), String(description), ERROR, lifetime, hideclose);
};

export const addShellInfoNotify = (text = '', description = '', lifetime = 5, hideclose = false) => {
    return addShellNotifyMessage(text, description, INFO, lifetime, hideclose);
};

export const addShellWarningNotify = (text = '', description = '', lifetime = 5, hideclose = false) => {
    return addShellNotifyMessage(text, description, WARNING, lifetime, hideclose);
};

export const addShellSuccessNotify = (text = '', description = '', lifetime = 5, hideclose = false) => {
    return addShellNotifyMessage(text, description, SUCCESS, lifetime, hideclose);
};

export const addShellNotifyMessage = (text = '', description = '', type = INFO, lifetime = 5, hideClose = false ) => {

    return {
        type: ADD_SHELL_NOTIFY_MESSAGE,
        payload: {
            text,
            description,
            type,
            lifetime,
            hideClose
        }
    }
};  
