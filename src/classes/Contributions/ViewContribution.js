/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

class ViewContribution {
    constructor( props ) {
        const { app, code, name, path, methods } = props;

        this.name = name || null;
        this.path = path || null;
        this.code = code || null;
        this.app = app || null;
        this.methods = methods || [];
    }

    getName() {
        return this.name;
    }

    getCode() {
        return this.code;
    }

    load() {
        return {
            application: this.app,
            view: this.code,
            path: this.path,
            iframeLoaded: !!this.path
        };
    }
}

export default ViewContribution;
