/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import Register from './auth/Register';
import Forgot from './auth/Forgot';
import Login from './auth/Login';

import 'assets/css/auth.css';

class Auth extends Component {
    render() {
        console.log("Auth.currentLanguage: ", currentLanguage);
        const { currentLanguage } = this.props;

        return (
            <Switch>
                <Route path="/register" language={currentLanguage}>
                    <Register key="register-block" />
                </Route>

                <Route path="/forgot"  language={currentLanguage}>
                    <Forgot key="forgot-block" />
                </Route>

                <Route path="/"  language={currentLanguage}>
                    <Login key="login-block" />
                </Route>
            </Switch>
        );
    }
}

const mapStateToProps = (appState) => {
    const { currentLanguage } = appState.ui;
    const { state, init } = appState.auth;

    return {
        currentLanguage,
        state,
        isInit: init
    };
};

Auth.propTypes = {
    currentLanguage: PropTypes.string
};

export default connect(mapStateToProps, {})(Auth);