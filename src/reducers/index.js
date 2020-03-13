/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import { combineReducers } from 'redux';

import ShellReducer from './ShellReducer';
import NotificationReducer from './NotificationReducer';
import ContributionPoints from './ContributionPoints';
import UIReducer from './UIReducer';

export default combineReducers({
    shell: ShellReducer,
    notify: NotificationReducer,
    cp: ContributionPoints,
    ui: UIReducer
});