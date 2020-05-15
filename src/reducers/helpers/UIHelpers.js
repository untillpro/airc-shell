/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import _ from 'lodash';
import i18next from 'i18next';
import Logger from 'base/classes/Logger';

export const setShellLanguages = (state) => {
    const langs = i18next.languages;

    if (langs && _.isArray(langs)) {
        return {
            ...state,
            availableLangs: langs
        }
    }

    return state;
};

export const setCurrentLanguage = (state, lang) => {
    const { availableLangs } = state;
    
    if ( availableLangs && lang ) {
        
        if (_.indexOf(availableLangs, lang) >= 0) {
            Logger.debug(lang, 'SELECTED LANG', 'helpers.setCurrentLanguage()')

            localStorage.setItem('shellLang', lang)
            
            return {
                ...state,
                currentLanguage: lang
            }
        }
    } else {
        Logger.error(availableLangs, `Can't set language to "${lang}"`, 'UIHelpers/setCurrentLanguage func');
    }

    return state;
};