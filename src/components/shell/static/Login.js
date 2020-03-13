/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import { bounce } from 'react-animations';
import styled, { keyframes } from 'styled-components';
import { LoginForm, RegisterForm } from 'components/shell/forms'

const Bounce = styled.div`animation: 2s ${keyframes`${bounce}`} infinite`;

class Login extends Component {
    constructor() {
        super();

        this.state = {
            register: false
        };
    }

    handleLinkClick() {
        const { register } = this.state;

        this.setState({ register: !register });
    }

    renderLink() {
        const { register } = this.state;

        if (register) return null;

        return (
            <div className="ushell-login-block-link">
                <a href="/#" onClick={this.handleLinkClick.bind(this)}>
                    Register
                </a>
            </div>
        );
    }

    render() {
        const { register } = this.state;

        return (
            <div className="ushell-container login">
                <div className="ushell-login-container">
                    <div className="ushell-login-block paper">
                        <div className="ushell-login-block-logo">
                            <img src={require('assets/img/logo-rounded.svg')} alt="Logo" />
                        </div>
                        <Bounce>
                            <div className="ushell-login-block-title">
                                Welcome back!
                            </div>
                        </Bounce>


                        <div className="ushell-login-block-illustration">
                            <img src={require('base/images/Illustrations/log-in.svg')} alt="Illustration" />
                        </div>

                        {register ? <RegisterForm /> : <LoginForm />}

                        {this.renderLink()}
                    </div>
                    <div className="ushell-login-bottom-navigation">
                        <ul>
                            <li><a href="http://untill.com" target="_blank" rel="noopener noreferrer">Homepage</a></li>
                            <li><a href="/" rel="noopener noreferrer">Knowledge base</a></li>
                            <li><a href="/" rel="noopener noreferrer">App store</a></li>
                            <li><a href="/" rel="noopener noreferrer">Google play</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;