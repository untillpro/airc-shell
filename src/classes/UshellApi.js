/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import CFG from 'config.js';
import Axios from 'axios';
import qs from 'qs';

class UApi {
	static async loadManifest(token) {
		return new Promise((resolve) => {
            fetch(`${CFG.API_HOST}/modules/manifest`, {
                method: 'GET',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((response) => {
                if (response.status == 200) {
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

	static async checkToken(token) {
		return new Promise((resolve, reject) => {
			if (!token) {
				reject(false);
			}

            fetch(`${CFG.API_HOST}/registry/check`, {
                method: 'post',
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((res) => res.json())
            .then((res) => {
                if (res.error) {
                    reject(res);
                } else {
                    resolve(res);
                }
            });
		});
    }
    
    static async authorize(login, password, isRegister) {
        return new Promise((resolve, reject) => {
			const data = { 
                login,
                password
            };

            let path = `${CFG.API_HOST}/user/login`;

            if (isRegister) path = `${CFG.API_HOST}/user/new`;

            fetch(path, {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(async (res) => {
                if (res.status === 200) {
                    var json = await res.json();
                    resolve(json); 
                } else {
                    var text = await res.text();
                    reject(text);
                }
            });
		});
    }

    static async invoke(queueId, path, token, params, method = 'POST', location = 1) {
        let data = {};

        if (params) {
            if (typeof params === 'string') {
                const parsedData = JSON.parse(params);

                if (parsedData) {
                    data = { ...data, ...parsedData};
                }
            } else if (typeof params === 'object') {
                data = { ...data, ...params};
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
                    return qs.stringify(params, {arrayFormat: 'repeat'})
                }
            }

            if (Axios[m]) {
                let ax = null;
                switch (m) {
                    case 'get': ax = Axios.get(`${CFG.API_HOST}/${queueId}/${path}`, config); break;
                    case 'patch':
                    case 'put':
                    case 'post': ax = Axios[m](`${CFG.API_HOST}/${queueId}/${path}`, data, config); break;
                    default: break;
                }

                if (ax) return ax.then((e) => resolve(e.data));
            }
            
            throw new Error(`method "${m}" not alowed at Axios`);
		});
    }
}

export default UApi;