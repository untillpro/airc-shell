/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import _ from 'lodash';

import * as Types from 'actions/types';

const INITIAL_STATE = {
    iframeLoaded: true,
    cstate: null,
    modalStack: [],
    staticStack: [],
    loading: true,
};

export default (state = INITIAL_STATE, action) => {
    let stack;

    switch (action.type) {
        case Types.INIT_APP: 
            stack = addStateToStack('shell', state.staticStack);
            
            if (action.payload.login) {
                stack = addStateToStack('login', stack);
            }

            return {
                ...state,
                staticStack: stack,
                modalStack: [],
                loading: false
            };

            case Types.SHOW_AUTH_MODAL: 
            stack = addStateToStack('auth', state.modalStack);

            return {
                ...state,
                modalStack: stack
            };

        case Types.HIDE_AUTH_MODAL: 
            stack = removeStateFromStack('auth', state.modalStack);

            return {
                ...state,
                modalStack: stack
            };

        case Types.SHOW_FORGOT_MODAL: 
            stack = addStateToStack('forgot', state.modalStack);

            return {
                ...state,
                modalStack: stack
            };

        case Types.HIDE_FORGOT_MODAL: 
            stack = removeStateFromStack('forgot', state.modalStack);    

            return {
                ...state,
                modalStack: stack
            };

        case Types.SET_AUTH_TOKEN: 
            return {
                ...state,
                staticStack: removeStateFromStack('login', state.staticStack || []),
                modalStack: removeStateFromStack('auth', state.modalStack || [])
            };

        case Types.DO_LOGOUT: 
            stack = state.staticStack || [];
            stack = addStateToStack('login', stack);

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

    if (!state || typeof state !== 'string') return null;

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