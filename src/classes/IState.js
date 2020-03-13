/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

export default class IState {
    constructor(parent = null, childs = [], result = null) {
        this.parent = parent; 
        this.childs = childs; 
        this.result = result; 
    }
    
    CanAcceptMessage(msg) { 
        let messageName = msg;
        
        if (typeof msg === 'object') {
            messageName = msg.GetName();
        }

        return typeof this[messageName] === 'function';
    }

    GetGuid() { //string
        return this.GetStaticGuid();
    }

    GetName() {
        throw new Error(`${this.constructor.name}: you should redeclare GetName() method`);
    }

    GetStackPropertyByName(propName) {
        if (this[propName] && typeof this[propName] !== 'function') {
            return this[propName];
        }

        if (this.parent != null) {
            return this.parent.GetStackPropertyByName(propName);
        }

        return null;
    }

    Detouch() {
        global.logger.log(`${this.GetName()} was detouched. If u see this message you possible should redeclare Detouch() method.`);
    }
}
