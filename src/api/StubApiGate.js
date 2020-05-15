/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import axios from 'axios';

export default class MockGate {
    constructor(host) {
        this.host = host || null;
    }

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

    async _fetch(data, url) {
        return axios({
            method: 'post',
            url: `${this.host}${url}`,
            data,
            responseType: "json"
        }).then(({ data }) => {
            return data;
        });
    }
}