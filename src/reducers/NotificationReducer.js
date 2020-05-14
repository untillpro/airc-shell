/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import _ from 'lodash';

import {
    ADD_SHELL_NOTIFY_MESSAGE
} from 'actions/';


const INITIAL_STATE = {
    notifications: {},
    last: null
};

export default (state = INITIAL_STATE, action) => {
    let newId = null;
    let newItem = null;
    let newNotifications = {};

    switch (action.type) {
        
        case ADD_SHELL_NOTIFY_MESSAGE: 
            if (action.payload) {
                newId = _.uniqueId();
        
                newItem = { 
                    ...action.payload,
                    timestamp: new Date().valueOf(),
                    id: newId
                };

                newNotifications = { ...state.notifications };
                newNotifications[newId] = newItem;
            }
        
            return {
                ...state,
                notifications: newNotifications,
                last: newId
            };
 
        default: 
            return state;
    }

    
};
