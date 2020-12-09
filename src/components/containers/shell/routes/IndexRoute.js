/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import i18next from 'i18next';

import "assets/css/index_route.css";

class IndexRoute extends PureComponent {
    render() {
        return (
            <div className="index-route-container">
                <div className="index-route-body">
                    <div className="index-route-body-title">
                        {i18next.text("Welcome to unTill Air Shell!")}
                    </div>
                    <div className="index-route-body-sep"></div>
                    <div className="index-route-body-text">
                        {i18next.text("Please select a module from top navigation bar.")}
                    </div>
                </div>
                
            </div>
        );
    };
}

export default connect()(IndexRoute);