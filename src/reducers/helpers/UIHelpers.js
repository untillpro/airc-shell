/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import _ from 'lodash';
import Logger from 'base/classes/Logger';

export const setShellLanguages = (state, langs = {}) => {
    if (langs && _.isPlainObject(langs)) {
        return {
            ...state,
            availableLangs: langs
        }
    }

    return state;
};

export const setCurrentLanguage = (state, code) => {
    const { availableLangs } = state;

    if (availableLangs && code && availableLangs[code]) {
        Logger.debug(code, 'SELECTED LANG', 'helpers.setCurrentLanguage()')

        localStorage.setItem('shellLang', code)

        return {
            ...state,
            currentLanguage: code
        }
    } else {
        Logger.error(availableLangs, `Can't set language to "${code}"`, 'UIHelpers/setCurrentLanguage func');
    }

    return state;
};