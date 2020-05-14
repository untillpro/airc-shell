/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import i18next from 'i18next';

const DEFAULT_LANG = 'en';

export default (baseLangs, callback) => {
    let lng = localStorage.getItem('lang') || DEFAULT_LANG;

    return i18next.init({
        fallbackLng: Object.keys(baseLangs),
        lng: lng,
        resources: baseLangs,
        interpolation: {
            escapeValue: false,
        }
    }, callback);
}