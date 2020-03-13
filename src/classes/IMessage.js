/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import _ from 'lodash';

export default class IMessage {
    constructor(data) {
        if (data) {
            _.each(data, (value, key) => {
                this[key] = value;
            });
        }
    }

    GetName() {
        throw new Error('You should redeclare GetName() method');
    }
}