/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import _ from 'lodash';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Auth, Shell} from 'components/containers';
import Footer from 'components/common/Footer';
import Logger from 'base/classes/Logger';
import NotificationsContainer from './NotificationsContainer';

import * as Modals from 'components/modals';

import initi18n from 'utils/initI18n';

import {
    SHELL_STATE,
    LOGIN_STATE
} from 'const/static_states';

import {
    MODAL_AUTH,
    MODAL_FORGOT
} from 'const/modal_states';

//actions

import {
    initApp,
    addShellErrorNotify,
    sendLaguageInitiated
} from 'actions';

//assets
import 'base/css/untill-base.css';
import 'assets/css/main.css';

//lng
import * as lng from 'lang';


class Root extends Component {
    componentDidMount() { 
        initi18n(lng, (err) => {
            if (err) {  
                this.props.addShellErrorNotify(err);
            } else {
                this.props.sendLaguageInitiated();
            }
        });
        
        this.props.initApp(window.location.pathname); // TODO как то надо избавиться от этого. возможно через ReactRouter
    }

    renderStaticStateComponent() {
        // тут надо все переделать. ввести номальную state-machine
        const { staticStack } = this.props;
        const cstate = _.last(staticStack);

        Logger.log(cstate, 'Current static state', 'components/Root');

        switch ( cstate ) {
            case LOGIN_STATE: 
                return <Auth />;
            case SHELL_STATE:
            default: 
                return <Shell />;
        }
    }

    renderModalStateComponent() {
        const { modalStack } = this.props;
        const cstate = _.last(modalStack);

        switch ( cstate ) {
            case MODAL_FORGOT: 
                return <Modals.ForgotPassword />;
            case MODAL_AUTH: 
                return <Modals.Auth />;
            default: 
                return null;
        }
    }

    render() {
        const { currentLanguage } = this.props;
        
        return (
            <Fragment>
                <div className="--wrapper" key={`root_${currentLanguage}`}>
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
    const { modalStack, staticStack, currentLanguage } = state.ui;

    return {
        modalStack, 
        staticStack,
        currentLanguage
    };
};

export default connect(mapStateToProps, { 
    initApp, 
    addShellErrorNotify,
    sendLaguageInitiated 
})(Root);