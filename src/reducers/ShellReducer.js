/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

//import _ from 'lodash';
import initState from 'utils/InitState';
import * as InitFuncs from './initiators/ShellStateInit';

import {
    AUTH_USER,
    INIT_STATE,
    //INIT_APP,
    //CHANGE_PATH,
    IFRAME_LOADING_FINISH,
    SET_AUTH_TOKEN,
    DO_LOGOUT,
    APPLY_MANIFEST,
    SELECT_SHELL_MODULE,
    SELECT_SHELL_VIEW,
    SELECT_PLUGIN
} from 'actions/';

const INITIAL_STATE = {
    token: null,
    tokenValid: false,
    tokenExpired: null,
    application: null,
    view: null,
    
    login: false,

    //path: null,
    manifest: null,
    visited: false,

    //module rights
    rights: {}
};

export default (state = INITIAL_STATE, action) => {
    //let path, arr;
    let app, view, apps;

    switch (action.type) {
        case INIT_STATE:
            return initState(state, InitFuncs);

            /*
        case INIT_APP:
            if (window && window.location && window.location.pathname) {
                path = window.location.pathname;

                if (path.indexOf('/') === 0) path = path.slice(1);

                arr = path.split('/');

                if (arr[0]) app = arr[0];
                if (arr[1]) view = arr[1];

                return {
                    ...state,
                    application: app || state.application,
                    view: view || state.view
                };
            }

            return state;
       

        case CHANGE_PATH:
            if (action.payload) {
                return {
                    ...state,
                    path: action.payload
                }
            }

            return state;
        */

        case IFRAME_LOADING_FINISH:
            return {
                ...state,
                iframeLoaded: true
            };

        case AUTH_USER:
            return {
                token: action.payload.token,
                tokenValid: true,
                tokenExpired: action.payload.ttl,
                authorized: true
            };

        case SET_AUTH_TOKEN:
            return {
                ...state,
                ...action.payload
            };

        case DO_LOGOUT:
            return {
                ...state,
                token: null,
                tokenValid: null,
                tokenExpired: null
            };

        case APPLY_MANIFEST:
            if (action.payload) {
                apps = Object.values(action.payload);

                if (!state.application && apps.length > 0) {
                    app = apps[0];

                    if (app.views && app.views.length > 0) {
                        view = app.views[0];
                    }
                }

                return {
                    ...state,
                    manifest: action.payload,
                    application: app ? app.code : state.application,
                    view: view ? view.code : state.view,
                };

            }

            return state;

        case SELECT_SHELL_MODULE:
            app = action.payload.application;
            view = action.payload.view;

            //window.history.pushState('', '', `/${app}/${view || ''}`); // not required due to use of react-router

            return {
                ...state,
                ...action.payload,
            };

        case SELECT_SHELL_VIEW:
            app = state.application;
            view = action.payload.view;

            //window.history.pushState('', '', `/${app}/${view || ''}`); // not required due to use of react-router

            return {
                ...state,
                ...action.payload
            };

        case SELECT_PLUGIN:
            return {
                ...state,
                application: action.payload.application,
                view: action.payload.view
            }

        default:
            return state;
    }
}