/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Input, Button, Checkbox } from 'antd';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";
import { withCookies } from 'react-cookie';
import { translate as t } from 'airc-shell-core';
import { motion } from "framer-motion";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { userShouldConfirm, authUser } from 'actions';
import { checkResponse } from 'utils/AuthHelpers';
import { addShellErrorNotify } from 'actions';

import Logo from 'assets/img/logo-rounded.svg';
import Illustration from 'base/images/Illustrations/log-in.svg';

class Login extends Component {
    constructor() {
        super();

        this.formRef = null;

        this.state = {
            firstTime: true,
            loading: false
        };

        this.onFinish = this.onFinish.bind(this);
        this.onFinishFailed = this.onFinishFailed.bind(this);
    }

    onFinish(values) {
        const { api } = this.props;
        //this.setState({ loading: true });

        api.auth(values)
            .then((res) => {
                this.handleResponse(res);
            })
            .catch((e) => {
                this.handleError(e.toString())
            });
    };

    onFinishFailed(errors) {
        console.log(errors);
    }

    handleError(e) {
        this.props.addShellErrorNotify(e);

        this.setState({
            loading: false
        });
    }

    handleResponse(res) {
        const { history, match } = this.props;
        const { path } = match;
        const { ttl, token, notConfirmed, email } = res;

        const r = checkResponse(res);
        let e = null;

        if (r === true) {
            this.props.authUser(token, ttl);
        } else {
            if (notConfirmed === true) {
                if (!token || !ttl) {
                    this.handleError(t('Auth response malformed', 'auth.login.errors'));
                } else {
                    history.push(`${path}register`);
                    this.props.userShouldConfirm(email, token, ttl);
                }
            } else {
                e = r;
            }
        }

        if (e !== null) {
            this.handleError(e.toString());
        }
    }

    renderWelcomeText() {
        const { visited } = this.props;

        if (visited === true) {
            return t("Welcome back", "auth.login");
        }

        return t("Hello", "auth.login");
    }

    render() {
        const { path } = this.props.match;
        const { loading } = this.state;

        return (
            <div className="ushell-container flex">
                <div className="ushell-login-container">
                    <motion.div  
                        className="ushell-login-block paper"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                    >
                        <div className="ushell-login-block-logo">
                            <img src={Logo} alt="Logo" />
                        </div>

                        <div className="ushell-login-block-title">
                            {this.renderWelcomeText()}

                        </div>

                        <div className="ushell-login-block-illustration">
                            <img src={Illustration} alt="Illustration" />
                        </div>

                        <Form
                            ref={this.formRef}
                            onFinish={this.onFinish}
                            onFinishFailed={this.onFinishFailed}
                            className="login-form form-block"
                            name="normal_login"
                            initialValues={{ remember: true }}
                        >
                            <Form.Item
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input your e-mail", "auth.login.errors")
                                    }
                                ]}
                            >
                                <Input
                                    prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder={t("Email", "auth.login")}
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input your Password", "auth.login.errors")
                                    }
                                ]}
                            >
                                <Input
                                    prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder={t("Password", "auth.login")}
                                />
                            </Form.Item>

                            <Form.Item name="remember" valuePropName="checked">
                                <Checkbox>{t("Remember me", "auth.login")}</Checkbox>
                            </Form.Item>

                            <Link className="login-form-forgot" to={`${path}forgot`}>{t("Forgot password", "auth.login")}</Link>

                            <br />

                            <Button
                                type="primary"
                                htmlType="submit"
                                className="login-form-button"
                                loading={loading}
                            >
                                {t("Sign in", "auth.login")}
                            </Button>

                            <br />

                            {t("Or", "auth.login")} <Link to={`${path}register`}>{t("register now", "auth.login")}</Link>
                        </Form>

                    </motion.div>
                    <motion.div 
                        className="ushell-login-bottom-navigation"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5}}
                    >
                        <ul>
                            <li><a href="http://untill.com" target="_blank" rel="noopener noreferrer">{t("Homepage", "auth.login")}</a></li>
                            <li><a href="/" target="_blank" rel="noopener noreferrer">{t("Knowledge base", "auth.login")}</a></li>
                            <li><a href="/" target="_blank" rel="noopener noreferrer">{t("App store", "auth.login")}</a></li>
                            <li><a href="/" target="_blank" rel="noopener noreferrer">{t("Google play", "auth.login")}</a></li>
                        </ul>
                    </motion.div>
                </div>
            </div >
        );
    }
}

Login.propTypes = {
    visited: PropTypes.bool,
    api: PropTypes.object,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    userShouldConfirm: PropTypes.func.isRequired,
    authUser: PropTypes.func.isRequired,
    addShellErrorNotify: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    const { api } = state.context;
    const { visited } = state.shell;

    return { api, visited };
};

const WrappedLogin = withCookies(withRouter(Login));

export default connect(mapStateToProps, {
    userShouldConfirm,
    authUser,
    addShellErrorNotify
})(WrappedLogin);