/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import _ from 'lodash';

export const checkResponse = (res) => {
    if (res.result === true) {
        return true
    } else if (res.err && _.isArray(res.err) && res.err.length > 0) {
        return (_.map(res.err, (e) => e.msg).join('; '));
    } else {
        return 'Something goes wrong';
    }
};