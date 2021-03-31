/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import _ from 'lodash';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Select } from 'antd';

//import Logger from 'base/classes/Logger';
import { setLanguage } from 'actions/';

const { Option } = Select;

class LangSelector extends PureComponent {
    constructor() {
        super();

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(value) {
        const { langs } = this.props; 

        //Logger.log(value, 'Selected language');

        if (_.isString(value) && value in langs) {
            this.props.setLanguage(value);
        }
        
    }

    renderOptions() {
        const { langs } = this.props;

        if (langs && _.isObject(langs) && _.size(langs) > 0) {
            return _.map(langs, (l, code) => {
                return <Option key={`lang_${code}`} value={code}>{l.name}</Option>
            });
        }

        return null;
    }

    render() {
        const { langs, currentLang, defaultLang } = this.props;
        
        if (langs && _.isObject(langs) && _.size(langs) > 0) {
            const l = currentLang || defaultLang;

            return (
                <div>
                    <Select 
                        value={l} 
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
    langs: PropTypes.object,
    setLanguage: PropTypes.func
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
