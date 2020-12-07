/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */
import _ from "lodash";
import blacklist from "blacklist";
import i18next from 'i18next';

const DEFAULT_LANG = 'en';

export default (baseLangs, callback) => {
    let lng = localStorage.getItem('lang') || DEFAULT_LANG;

    let availableLangs = {};
    let locales = {};

    if (_.size(baseLangs) > 0 ) {

        _.forEach(baseLangs, (l) => {
            let o = checkLanguage(l);

            if (o !== false) {
                availableLangs[o.locale] = blacklist(o, 'translation');

                locales[o.locale] = { translation: o.translation };
            }
        });

        if (_.size(locales) > 0) {
            i18next.init({
                fallbackLng: Object.keys(locales),
                lng: lng,
                resources: locales,
                interpolation: {
                    escapeValue: false,
                }
            }, callback);
        }
    }

    return availableLangs;
}

const checkLanguage = (lang) => {
    if (!_.isPlainObject(lang)) {
        return false;
    }

    const { name, code, locale, iso, translation } = lang;

    if (
        (!name || !_.isString(name)) ||
        (!code || !_.isString(code)) ||
        (!locale || !_.isString(locale)) ||
        (!iso || !_.isString(iso)) ||
        (!translation || !_.isPlainObject(translation))
    ) {
        return false;
    }

    return {
        name, code, locale, iso, translation
    };
};

