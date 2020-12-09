/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import _ from 'lodash';
import initState from 'utils/InitState';

import * as InitFuncs from './initiators/UIStateInit';

import { 
    setCurrentLanguage,
    setShellLanguages
} from './helpers/UIHelpers';

import {
    INIT_STATE,
    INIT_APP,
    SHOW_AUTH_MODAL,
    HIDE_AUTH_MODAL,
    SHOW_FORGOT_MODAL,
    HIDE_FORGOT_MODAL,
    SET_AUTH_TOKEN,
    DO_LOGOUT,
    SET_LANGUAGE,
    LAGUAGES_INITIATED
} from 'actions';

import {
    SHELL_STATE,
    LOGIN_STATE
} from 'const/static_states';

import {
    MODAL_AUTH,
    MODAL_FORGOT
} from 'const/modal_states';

const INITIAL_STATE = {
    appInit: false,
    iframeLoaded: true,
    modalStack: [],
    staticStack: [],
    loading: true,
    defaultLanguage: 'en',
    currentLanguage: null,
    availableLangs: null
};

// TODO Create Stack object

export default (state = INITIAL_STATE, action) => {
    let stack;

    switch (action.type) {
        case INIT_STATE:
            return initState(state, InitFuncs);

        case INIT_APP:
            stack = addStateToStack(SHELL_STATE, state.staticStack);

            if (action.payload.login) {
                stack = addStateToStack(LOGIN_STATE, stack);
            }

            return {
                ...state,
                appInit: true,
                staticStack: stack,
                modalStack: [],
                loading: false
            };

        case LAGUAGES_INITIATED: 
            return setShellLanguages(state, action.payload);

        case SET_LANGUAGE: 
            return setCurrentLanguage(state, action.payload);

        case SHOW_AUTH_MODAL:
            stack = addStateToStack(MODAL_AUTH, state.modalStack);

            return {
                ...state,
                modalStack: stack
            };

        case HIDE_AUTH_MODAL:
            stack = removeStateFromStack(MODAL_AUTH, state.modalStack);

            return {
                ...state,
                modalStack: stack
            };

        case SHOW_FORGOT_MODAL:
            stack = addStateToStack(MODAL_FORGOT, state.modalStack);

            return {
                ...state,
                modalStack: stack
            };

        case HIDE_FORGOT_MODAL:
            stack = removeStateFromStack(MODAL_FORGOT, state.modalStack);

            return {
                ...state,
                modalStack: stack
            };

        case SET_AUTH_TOKEN:
            return {
                ...state,
                staticStack: removeStateFromStack(LOGIN_STATE, state.staticStack || []),
                modalStack: removeStateFromStack(MODAL_AUTH, state.modalStack || [])
            };

        case DO_LOGOUT:
            stack = state.staticStack || [];
            stack = addStateToStack(LOGIN_STATE, stack);

            return {
                ...state,
                staticStack: stack,
                token: null,
                tokenValid: null,
                tokenExpired: null
            };

        default:
            return state;
    }
};

const addStateToStack = (state, stack) => {
    let newStack;

    if (stack && stack.length > 0) newStack = [...stack];

    if (!state || typeof state !== 'string') return null;

    if (!newStack) newStack = [];

    const last = _.last(newStack);

    if (last !== state && !isInStack(state, newStack)) newStack.push(state);

    return newStack;
};

const removeStateFromStack = (state, stack) => {
    let newStack;

    if (stack && stack.length > 0) newStack = [...stack];

    if (!state || typeof state !== 'string') return stack;

    if (!newStack) newStack = [];

    const last = _.last(newStack);

    if (last === state) newStack.pop();

    return newStack;
};

const isInStack = (value, stack) => {
    if (!value || !stack) return false;

    if (stack.indexOf(value) >= 0) return true;

    return false;
};