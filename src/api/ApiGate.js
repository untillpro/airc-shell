/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import _ from 'lodash';
import axios from 'axios';
import qs from 'qs';
import checkSyncEntries from './utils/CheckSyncEntries';
import checkConfOperations from './utils/CheckConfOperations';
import SProtBuilder from 'base/classes/SProtBuilder';

class ApiGate {
    constructor(host) {
        this.host = host || null;
    }

    static async loadManifest(token) {
        return new Promise((resolve) => {
            fetch(`${this.host}/modules/manifest`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((response) => {
                    if (response.status === 200) {
                        return response.json();
                    }

                    return null;
                })
                .then((response) => {
                    resolve(response);
                })
                .catch((e) => {
                    throw new Error(e.message);
                });
        });
    }

    static async invoke(queueId, path, token, params, method = 'POST', location = 1) {
        let data = {};

        if (params) {
            if (typeof params === 'string') {
                const parsedData = JSON.parse(params);

                if (parsedData) {
                    data = { ...data, ...parsedData };
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

            if (axios[m]) {
                let ax = null;
                switch (m) {
                    case 'get': ax = axios.get(`${this.host}/${queueId}/${path}`, config); break;
                    case 'patch':
                    case 'put':
                    case 'post': ax = axios[m](`${this.host}/${queueId}/${path}`, data, config); break;
                    default: break;
                }

                if (ax) return ax.then((e) => resolve(e.data));
            }

            throw new Error(`method "${m}" not alowed at axios`);
        });
    }

    // auth 

    async auth(data) {
        return this._fetch(data, '/users/login');
    }

    async isAvailable(data) {
        return this._fetch(data, '/users/is_available');
    }

    async register(data) {
        return this._fetch(data, '/users/new');
    }

    async confirm(data) {
        return this._fetch(data, '/users/confirm');
    }

    async resend(data) {
        return this._fetch(data, '/users/resend');
    }

    async forgot(data) {
        return this._fetch(data, '/users/forgot');
    }

    async reset(data) {
        return this._fetch(data, '/users/reset');
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

    async collection(token, type, wsids, props = {}) {
        const { 
            entries, 
            page, 
            page_size, 
            show_deleted, 
            required_fields, 
            required_classificators 
        } = props;

        console.log('collection method call:', token, type, wsids, entries, page, page_size, show_deleted);

        
        const params = {};
        let location = null;
        
        if (type && typeof type === 'string') {
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

        if (entries && _.isArray(entries)) {
            params['Entries'] = entries;
        } else {
            params['Entries'] = null;
        }

        if (show_deleted === true) {
            params['ShowDeleted'] = 1;
        } else {
            params['ShowDeleted'] = 0;
        }

        if (required_fields && _.isArray(required_fields) && required_fields.length > 0) {
            params['Fields'] = required_fields;
        }

        if (required_classificators && _.isArray(required_classificators) && required_classificators.length > 0) {
            params['RequiredClassifiers'] = required_classificators;
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

        this.invoke('airs-bp', location, 'sync', token, params);
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
            throw new Error('api.log() call error: workspace IDs not specified or wrong given: ' + wsids);
        }

        if (_.isNumber(from) && from >= 0) {
            params['FromDateTime'] = parseInt(from);
        }

        if (_.isNumber(to) && to > 0) {
            params['ToDateTime'] = parseInt(to);
        }

        if (type !== null && type !== undefined && typeof type === 'string') {   
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

        if (show === true) {
            params['Show'] = 1;
        } else {
            params['Show'] = 0;
        }

        return this.invoke('airs-bp', location, 'log', token, params)
            .then((res) => this._buildData(res));
    }

    async _fetch(data, url) {
        return axios({
            method: 'post',
            url: `${this.host}${url}`,
            data,
            responseType: "json",
        }).then(({ data }) => {
            return data;
        });
    }

    _buildData(response) {
        let resultData = {};

        console.log('_buildData', response);

        if (response && response["sections"] && _.isArray(response["sections"])) {
            console.log("Response: ", response);
            const builder = new SProtBuilder();
            resultData = builder.build(response["sections"]);
        }

        console.log('_buildData resultData', resultData);

        return resultData;
    }
}

export default ApiGate;