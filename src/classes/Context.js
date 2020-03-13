/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

class Context {
    constructor() {
        this.data = {};
    }

    set(key, entity) {
        if (key) {
            this.data[key] = entity;
        }
    }

    get(key) {
        if (this.data[key]) {
            return this.data[key];
        }

        throw new Error(`Context exception: can't get context entity with key "${key}"`);
    }

    query(key) {
        if (this.data[key]) {
            return this.data[key];
        }
        
        return undefined;
    }

    clear() {
        this.data = {};
    }
}

export default Context;