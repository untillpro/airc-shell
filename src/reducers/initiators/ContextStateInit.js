/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import isProd from 'is-prod';
//import ApiGate from 'api/ApiGate';
import MockApiGate from 'api/MockApiGate';


export const initAPI = (state) => {
    let api;

    if (isProd.isDevelopment()) {
        api = new MockApiGate('https://air-alpha.untill.ru/api');
        //api = new MockApiGate('http://localhost:8001/api');
    } else {
        api = new MockApiGate('https://air-alpha.untill.ru/api');
        //api = new MockApiGate('https://air-test.untill.ru/api');
        //api = new ApiGate('https://hetzner.air.untill.ru/api'); //TODO
    }

    return {
        ...state,
        api
    };
}