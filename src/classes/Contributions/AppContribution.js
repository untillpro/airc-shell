/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

class AppContribution {
    constructor(code, name, path, view) {
        this.name = name || null;
        this.path = path || null;
        this.code = code || null;
        this.view = view || null;
    }

    getName() {
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