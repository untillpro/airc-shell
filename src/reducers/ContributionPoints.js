/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import _ from 'lodash';
import * as Contributions from 'classes/Contributions';
import * as Types from 'actions/types';

const INITIAL_STATE = {
    APPS: {},
    VIEWS: {},

    path: null
};

export default (state = INITIAL_STATE, action) => {
    
    switch (action.type) {
        case Types.APPLY_MANIFEST: 
            const manifest = action.payload;

            const apps = {};
            const views = {};

            //apllying manifest and building conribution points based on it

            _.each(manifest, (app) => {
                if (app.code) {
                    const { code, name, path, initialView } = app;

                    const CPApp = new Contributions.AppContribution(code, name, path, initialView);
                    apps[app.code] = CPApp;

                    if (app.views && app.views.length > 0) {
                        views[app.code] = {};

                        app.views.forEach((view) => {
                            let viewContribution = null;
                            
                            if (view.code) {
                                switch (view.type) {
                                    case "module": 
                                        viewContribution = new Contributions.ViewModuleContribution({
                                            app: app.code,
                                            code: view.code,
                                            name: view.name,
                                            path: view.path,
                                            data: view.data,
                                            methods: app.methods
                                        }); break;
                                    
                                    default: 
                                        viewContribution = new Contributions.ViewContribution({
                                            app: app.code, 
                                            code: view.code, 
                                            name: view.name, 
                                            path: view.path
                                        }); break;
                                }

                                views[app.code][view.code] = viewContribution;
                            } else {
                                throw new Error("Error occured in recevied manifest: view code is not specified.", manifest);
                            }
                        });
                    }
                } else {
                    throw new Error("Error occured in recevied manifest: application code is not specified.", manifest);
                }
            });

            return {
                ...state,
                APPS: apps,
                VIEWS: views
            }

        default: 
            return state;
    }

};