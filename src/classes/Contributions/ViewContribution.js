/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

class ViewContribution {
    constructor( props ) {
        const { app, code, name, ml_name, path, methods } = props;

        this.name = name || null;
        this.ml_name = ml_name || ml_name;
        this.path = path || null;
        this.code = code || null;
        this.app = app || null;
        this.methods = methods || [];
    }

    getName(lang) {
        if (this.ml_name && typeof this.ml_name === 'object' && this.ml_name[lang]) {
            return this.ml_name[lang];
        }
        
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
