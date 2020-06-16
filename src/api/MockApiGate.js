/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import _ from 'lodash';
import Logger from 'base/classes/Logger';
import qs from 'qs';
import manifest from 'data/mock/manifest.json';
import Axios from 'axios';
import checkConfOperations from './utils/CheckConfOperations';
import checkSyncEntries from './utils/CheckSyncEntries';

import SProtBuilder from 'base/classes/SProtBuilder';

const MOCK_AUTH_TOKEN = 'mock.auth.token';
const MOCK_CONFIRM_TOKEN = 'mock.confirm.token';

const EXIST_EMAIL = "test@test.com";
const NOT_CONFIRMED_EMAIL = "noconfirm@test.com";
const CONFIRM_CODE = '1111';

class MockApiGate {
    constructor(host) {
        this.host = host || null;
    }

    async loadManifest(token) {
        return manifest;
    }

    async invoke(queueId, wsid = 1, path, token, params, method = 'POST') {
        let data = {};

        if (params) {
            if (typeof params === 'string') {
                try {
                    const parsedData = JSON.parse(params);

                    if (parsedData) {
                        data = { ...data, ...parsedData };
                    }
                } catch (e) {
                    console.error('Wrong params format in api.invoke() method: json string or object expected', params)
                }

            } else if (typeof params === 'object') {
                data = { ...data, ...params };
            }
        }

        return new Promise((resolve, reject) => {
            const m = method ? method.toLowerCase() : 'post';

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            if (m === 'get') {
                config.params = data;
                config.paramsSerializer = params => {
                    return qs.stringify(params, { arrayFormat: 'repeat' })
                }
            }

            if (Axios[m]) {
                let ax = null;

                switch (m) {
                    case 'get': ax = Axios.get(`${this.host}/${queueId}/${wsid}/${path}`, config); break;
                    case 'patch':
                    case 'put':
                    case 'post': ax = Axios[m](`${this.host}/${queueId}/${wsid}/${path}`, data, config); break;

                    default: break;
                }



                if (ax) return ax
                    .then((e) => {
                        console.log('MockApiGate.invoke() result', e);

                        resolve(e.data);
                    });
            }

            throw new Error(`method "${m}" not alowed at Axios`);
        });
    }

    // auth 

    async auth(data) {
        if (!data) {
            throw new Error('No data is given for API.auth method');
        }
        const err = [];
        const { email, password } = data;
        const ttl = new Date().valueOf() + 86400000;

        if (!email) {
            throw new Error('No e-mail is given');
        }

        if (!password) {
            throw new Error('No password is given');
        }

        if (email === EXIST_EMAIL && password === '123456') {
            return {
                result: true,
                err: null,
                notConfirmed: false,
                token: MOCK_AUTH_TOKEN,
                ttl,
                email
            }
        } else if (email === NOT_CONFIRMED_EMAIL && password === '123456') {
            this._addError(err, 'User not confirmed');

            return {
                result: false,
                err,
                notConfirmed: true,
                token: MOCK_CONFIRM_TOKEN,
                ttl,
                email
            }
        } else {
            this._addError(err, 'Wrong email or password');

            return {
                result: false,
                err,
                notConfirmed: false,
                token: null,
                ttl: null,
                email
            }
        }
    }

    async isAvailable(data) {
        if (!data) {
            throw new Error('No data is given for API.auth method');
        }
        const err = [];
        const { email } = data;

        if (!email) {
            throw new Error('No e-mail is given');
        }

        if (email === EXIST_EMAIL) {
            this._addError(err, 'This email already in use', 'email', email);

            return {
                result: false,
                err
            }
        } else {
            return {
                result: true,
                err: null
            }
        }
    }

    async register(data) {
        Logger.debug(data, 'Register method', 'MockApiGate');

        const ttl = new Date().valueOf() + 86400000;
        const err = [];
        const { email, password, confirm, country, prefix, phone, agree } = data;

        if (!email) {
            this._addError(err, 'Enter e-mail');
        } else if (email === EXIST_EMAIL) {
            this._addError(err, 'This email already in use', 'email', email);
        }

        if (!password) {
            this._addError(err, 'Enter password');
        } else if (!confirm) {
            this._addError(err, 'Enter confirm password');
        } else if (password !== confirm) {
            this._addError(err, 'Password and confirmation not equals');
        }

        if (!country) {
            this._addError(err, 'Select country');
        }

        if (!prefix) {
            this._addError(err, 'Select phone prefix');
        }

        if (!phone) {
            this._addError(err, 'Enter your phone number');
        }

        if (agree !== true) {
            this._addError(err, 'You must agree with personal agreement');
        }

        return {
            result: err.length <= 0,
            err,
            needConfirm: true,
            token: MOCK_CONFIRM_TOKEN,
            tokenttl: ttl,
            email
        }
    }

    async confirm(data) {
        Logger.debug(data, 'Confirm method', 'MockApiGate');

        if (!data) {
            throw new Error('No data is given for API.auth method');
        }

        const { code, token } = data;
        const err = [];

        if (!code) {
            this._addError(err, 'Empty confirmation code');
        }

        if (!token) {
            this._addError(err, 'Empty confirmation token');
        }

        if (code !== CONFIRM_CODE) {
            this._addError(err, 'Confirmation code is incorrect');
        }

        if (token !== MOCK_CONFIRM_TOKEN) {
            this._addError(err, 'Wrong token received. Resend token.');
        }

        return {
            result: err.length <= 0,
            err,
        };
    }

    async resend(data) {
        Logger.debug(data, 'Resend method', 'MockApiGate.js');

        const ttl = new Date().valueOf() + 86400000;

        return {
            result: true,
            err: [],
            token: MOCK_CONFIRM_TOKEN,
            tokenttl: ttl
        }
    }

    async forgot(data) {
        Logger.debug(data, 'Forgot method', 'MockApiGate');

        const ttl = new Date().valueOf() + 86400000;

        if (!data) {
            throw new Error('No data is given for API.auth method');
        }

        const err = [];
        const { email } = data;

        let confirmed = false;

        if (!email) {
            this._addError(err, 'Enter e-mail');
        } else if (email === EXIST_EMAIL) {
            confirmed = true;
        } else if (email === NOT_CONFIRMED_EMAIL) {
            confirmed = false;
        } else {
            this._addError(err, 'User with this email is not registered');
        }

        return {
            result: err.length <= 0,
            err,
            ttl: ttl,
            token: !confirmed ? MOCK_CONFIRM_TOKEN : null,
            confirmed: false
        };
    }

    async reset(data) {
        return {
            result: true,
            err: [],
        };
    }

    async conf(token, operations, wsids, timestamp, offset) {
        console.log('Conf method call:', token, operations, wsids, timestamp, offset);

        const params = {};
        let location = null;

        if (operations) {
            params['Operations'] = checkConfOperations(operations);
        } else {
            throw new Error('Wrong "operations" prop: expected an array of objects, received' + operations);
        }

        if (wsids && _.isArray(wsids) && wsids.length > 0) {
            params['WSIDs'] = wsids;
            location = parseInt(wsids[0]);
        } else {
            throw new Error('Wrong "WSIDs" prop: expected an array of integers, received ', wsids);
        }

        if (timestamp && timestamp > 0) {
            params['Timestamp'] = parseInt(timestamp);
        } else {
            params['Timestamp'] = new Date().valueOf();
        }

        if (_.isNumber(offset) && offset >= 0) {
            params['Offset'] = parseInt(offset);
        } else {
            params['Offset'] = 0; //TODO
        }

        return this.invoke('airs-bp', location, 'conf', token, params);
    }

    async collection(token, type, wsids, entries, page, page_size, show_deleted) {
        console.log('collection method call:', token, type, wsids, entries, page, page_size, show_deleted);

        /*
        const { 
            entries, 
            page, 
            page_size, 
            show_deleted, 
            required_fields, 
            required_classificators 
        } = props;
        */

        const params = {};
        let location = null;

        if (type !== null && type !== undefined && typeof type === 'string') {
            params['Type'] = type;
        } else {
            throw new Error('api.collection() call error: wrong "Type" prop: expected a string, received ' + type);
        }

        if (wsids && _.isArray(wsids) && wsids.length > 0) {
            params['WSIDs'] = wsids;
            location = parseInt(wsids[0]);
        } else {
            throw new Error('api.collection() call error: wrong "WSIDs" prop: expected an array of integers, received ', wsids);
        }

        if (page && page >= 0) {
            params['Page'] = page;
        } else {
            params['Page'] = 0;
        }

        if (page_size && page_size > 0) {
            params['PageSize'] = page_size;
        } else {
            params['PageSize'] = null;
        }

        /*
        if (required_fields && _.isArray(required_fields) && required_fields.length > 0) {
            params['Fields'] = required_fields;
        }

        if (required_classificators && _.isArray(required_classificators) && required_classificators.length > 0) {
            params['RequiredClassifiers'] = required_classificators;
        }
        */

        if (entries && _.isArray(entries) && entries.length > 0) {
            params['Entries'] = entries;
        } else {
            params['Entries'] = null;
        }

        if (show_deleted === true) {
            params['ShowDeleted'] = 1;
        } else {
            params['ShowDeleted'] = 0;
        }

        return this.invoke('airs-bp', location, 'collection', token, params)
            .then((res) => this._buildData(res));
    }

    async sync(token, location, entries) {
        //TODO - not confirmed
        console.log('sync method call:', token, entries);
        const params = {};

        if (entries && _.isArray(entries)) {
            params['Entries'] = checkSyncEntries(entries);
        } else {
            throw new Error('api.sync() call error: wrong "Entires" prop: expected an array of objects, received ', entries);
        }

        return this.invoke('airs-bp', location, 'sync', token, params);
    }

    async log(token, wsids, props) {
        //TODO - stub. most likely it will be changed
        console.log('log method call:', token, props);
        const { from, to, type, from_offset, to_offset, show } = props;

        const params = {};
        let location = null;

        if (wsids && _.isArray(wsids)) {
            location = parseInt(wsids[0], 10);
            params["WSIDs"] = wsids;
        } else {
            console.log('wsids: ', wsids);
            throw new Error('api.log() call error: workspace IDs not specified or wrong given: ' + wsids);
        }

        if (_.isNumber(from) && from >= 0) {
            params['From'] = parseInt(from);
        }

        if (_.isNumber(to) && to > 0) {
            params['To'] = parseInt(to);
        }

        if (type && typeof type === 'string') {
            params['Type'] = type;
        }

        if (from_offset) {
            params['FromOffset'] = parseInt(from_offset);
        } else {
            params['FromOffset'] = 0;
        }

        if (to_offset && to_offset > 0) {
            params['ToOffset'] = parseInt(to_offset);
        }

        params['Show'] = !!show;

        return this.invoke('airs-bp', location, 'log', token, params)
            .then((res) => this._buildData(res));
    }

    // private methods

    _addError(errors, msg, param, value) {
        errors.push({
            msg,
            param,
            value
        });

        return errors;
    }

    _buildData(response) {
        let resultData = {};

        console.log('_buildData', response);

        if (response && response["sections"] && _.isArray(response["sections"])) {
            const builder = new SProtBuilder();
            resultData = builder.build(response["sections"]);
        }

        console.log('_buildData resultData', resultData);

        return resultData;
    }
}

export default MockApiGate;