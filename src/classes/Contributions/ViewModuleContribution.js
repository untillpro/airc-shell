/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import Logger from 'base/classes/Logger';

class ViewModuleContribution {
    constructor( props ) {
        const { name, data, code, path, app, methods } = props;

        this.name = name || null;
        this.data = data || null;
        this.code = code || null;
        this.path = path || null;
        this.app = app || null;
        this.methods = methods || [];
    }

    getName() {
        return this.name;
    }

    getCode() {
        return this.code;
    }

    invoke() {
        Logger.debug(global.API, `Try load in ViewModuleContribution ${this.name}`, 'ViewModuleContribution');

        if (global.API && global.API.dispatch) {
            Logger.debug('dispathcing');

            global.API.dispatch({
                type: 'view_change',
                payload: this.code
            });
        }
    }

    load() {
        this.invoke();

        return {
            application: this.app,
            path: this.path,
            view: this.code
        };
    }
}

export default ViewModuleContribution;
