/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import _ from 'lodash';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

//components
import * as Static from 'components/shell/static';

import Footer from 'components/shell/common/Footer';

import NotificationsContainer from './NotificationsContainer';

import * as Modals from 'components/shell/modals';

//actions

import {
    initApp
} from 'actions';

//assets
import 'base/css/untill-base.css';
import 'assets/css/main.css';


class Root extends Component {
    componentDidMount() {
        this.props.initApp(window.location.pathname);
    }

    renderStaticStateComponent() {
        const { staticStack } = this.props;
        const cstate = _.last(staticStack);

        switch ( cstate ) {
            case 'login': 
                return <Static.Login />;

            default: 
                return <Static.Shell />;
        }
    }

    renderModalStateComponent() {
        const { modalStack } = this.props;
        const cstate = _.last(modalStack);

        switch ( cstate ) {
            case 'forgot': 
                return <Modals.ForgotPassword />;
            case 'auth': 
                return <Modals.Auth />;
            default: 
                return null;
        }
    }

    render() {
        return (
            <Fragment>
                <div className="--wrapper">
                    <NotificationsContainer left top />

                    {this.renderStaticStateComponent()}
                    
                    <Footer />
                </div>

                {this.renderModalStateComponent()}
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    const { modalStack, staticStack } = state.ui;

    return {
        modalStack, 
        staticStack
    };
};

export default connect(mapStateToProps, { initApp })(Root);