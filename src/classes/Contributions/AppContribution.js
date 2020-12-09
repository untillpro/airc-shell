/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

class AppContribution {
    constructor(code, name, ml_name, path, view) {
        this.name = name || null;
        this.ml_name = ml_name || null;
        this.path = path || null;
        this.code = code || null;
        this.view = view || null;
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
            application: this.code,
            path: this.path,
            view: this.view,
            iframeLoaded: !!this.path
        };
    }
}

export default AppContribution;