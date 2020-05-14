/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import Cookies from 'js-cookie';

export const isSiteAlreadyVisited = (state) => {
    const visited = Cookies.get('air-visited');

    let isVisited = false;

    if (visited !== 'Y') {
        Cookies.set('air-visited', 'Y');
    } else {
        isVisited = true;
    }

    return { ...state, visited: isVisited };
}

export const initUserRememberedSession = (state) => {
    // todo
    return state;
}