/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { PureComponent } from 'react';
import { translate as t } from 'airc-shell-core';
import { connect } from 'react-redux';

import "assets/css/index_route.css";

class IndexRoute extends PureComponent {
    render() {
        const { lang } = this.props;

        return (
            <div key={`index_${lang}`} className="index-route-container">
                <div className="index-route-body">
                    <div className="index-route-body-title">
                        {t("Welcome to unTill Air Shell", "shell")}
                    </div>
                    <div className="index-route-body-sep"></div>
                    <div className="index-route-body-text">
                        {t("Please select a module from top navigation bar", "shell")}
                    </div>
                </div>
                
            </div>
        );
    };
}

const mapStateToProps = (state) => {
    const { currentLanguage } = state.ui; 

    return { lang: currentLanguage }
};

export default connect(mapStateToProps)(IndexRoute);