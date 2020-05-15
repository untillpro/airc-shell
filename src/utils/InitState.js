/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import _ from 'lodash';

export default (initState, initFunctions) => {
    let state = {};

    if (initState && _.isObject(initState)) {
        state = { ...initState };
    }

    if (initFunctions && _.size(initFunctions) > 0) {
        _.forEach(initFunctions, (f, n) => {
            if (typeof f === 'function') {
                const r = f(state);

                if (_.isObject(r)) {
                    state = r;
                } else {
                    throw new Error(`Wrong return type of init function "${n}": plain object expected`);
                }
            }
        });
    }

    return state;
};
