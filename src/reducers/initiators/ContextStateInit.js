/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import isProd from 'is-prod';
//import ApiGate from 'api/ApiGate';
import MockApiGate from 'api/MockApiGate';
import Logger from 'base/classes/Logger';


export const initAPI = (state) => {
    let api;

    if (isProd.isDevelopment()) {
        api = new MockApiGate('https://air-alpha.untill.ru/api');
        //api = new MockApiGate('http://localhost:8001/api');
    } else {
        const url = `${window.location.origin}/api`;
        Logger.info(`URL: ${url}`, "Init api gate");

        api = new MockApiGate(url);
        
        //api = new MockApiGate('https://air-alpha.untill.ru/api');
        //api = new MockApiGate('https://air-test.untill.ru/api');
        //api = new ApiGate('https://hetzner.air.untill.ru/api'); //TODO
    }

    return {
        ...state,
        api
    };
}