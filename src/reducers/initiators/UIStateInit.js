/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import i18next from 'i18next';
import Logger from 'base/classes/Logger';

export const initCurrentLanguage = (state) => {
    let lang = i18next.language;
    const locaLang = localStorage.getItem('shellLang');

    if (locaLang && typeof locaLang === 'string') {
        lang = locaLang;
    }

    i18next.changeLanguage(lang);
    
    Logger.debug(lang, "LANGUAGE ON INIT", 'initCurrentLanguage')

    return {
        ...state, 
        currentLanguage: lang
    };
}