/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Select } from 'antd';
import i18next from 'i18next';

import Logger from 'base/classes/Logger';
import { setLanguage } from 'actions/';
import AvailableLanguages from 'const/shell_langs';

const { Option } = Select;

class LangSelector extends Component {
    constructor() {
        super();

        this.handleChange = this.handleChange.bind(this);
    }

    shouldComponentUpdate(nextProps) {
        Logger.debug(nextProps, 'Props:', 'LangSelector.shouldComponentUpdate()');

        if (nextProps.currentLang !== this.props.currentLang) {
            return true;
        }

        return false;
    }

    handleChange(value) {
        const { langs } = this.props; 

        Logger.log(value, 'Selected language');

        if (value && langs && _.indexOf(langs, value) >= 0) {
            i18next.changeLanguage(value, () => {
                this.props.setLanguage(value);
            });
        }
        
    }

    renderOptions() {
        const { langs } = this.props;

        if (langs && _.isObject(langs) && _.size(langs) > 0) {
            Logger.log(langs, 'Languages:');
            Logger.log(AvailableLanguages, 'Available langs:')
            return _.map(AvailableLanguages, (l, code) => {
                if (_.indexOf(langs, code) >= 0) {
                    return <Option key={`lang_${l.code}`} value={l.code}>{l.label}</Option>
                } 
                
                return null;
            });
        }

        return null;
    }

    render() {
        const { langs, currentLang, defaultLang } = this.props;
        
        if (langs && _.isObject(langs) && _.size(langs) > 0) {

            const l = currentLang || defaultLang;
            Logger.debug(l, 'currentLang', 'render');

            return (
                <div>
                    <Select 

                        defaultValue={l} 
                        style={{ width: 120 }} 
                        bordered={false}
                        onChange={this.handleChange}
                    >   
                        {this.renderOptions()}
                    </Select>
                </div>
            );
        }

        return null;
    }
}

LangSelector.propTypes = {
    defaultLang: PropTypes.string,
    currentLang: PropTypes.string,
    langs: PropTypes.array
};


const mapStateToProps = (state) => {
    const { defaultLanguage, currentLanguage, availableLangs } = state.ui;

    return {
        langs: availableLangs,
        defaultLang: defaultLanguage,
        currentLang: currentLanguage
    };
};

export default connect(mapStateToProps, { setLanguage })(LangSelector);
