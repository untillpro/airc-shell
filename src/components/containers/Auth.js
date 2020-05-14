/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import Register from './auth/Register';
import Forgot from './auth/Forgot';
import Login from './auth/Login';

import 'assets/css/auth.css';

class Auth extends Component {
    render() {
        return (
            <Switch>
                <Route path="/register" >
                    <Register key="register-block" />
                </Route>

                <Route path="/forgot" >
                    <Forgot key="forgot-block" />
                </Route>

                <Route path="/" >
                    <Login key="login-block" />
                </Route>
            </Switch>
        );
    }
}

const mapStateToProps = (appState) => {
    const { state, init } = appState.auth;

    return {
        state,
        isInit: init
    };
};

export default connect(mapStateToProps, {})(Auth);