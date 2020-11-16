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
import i18next from 'i18next';
import { motion } from "framer-motion";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { userShouldConfirm, authUser } from 'actions';
import { checkResponse } from 'utils/AuthHelpers';
import { addShellErrorNotify } from 'actions';

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

        console.log("Login form submit: ", values);

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
                    this.handleError(i18next.t('auth.login.errors.auth_presponse_malformder'));
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
            return i18next.t("auth.login.hello_2");
        }

        return i18next.t("auth.login.hello_1");
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
                            <img src={require('assets/img/logo-rounded.svg')} alt="Logo" />
                        </div>

                        <div className="ushell-login-block-title">
                            {this.renderWelcomeText()}

                        </div>

                        <div className="ushell-login-block-illustration">
                            <img src={require('base/images/Illustrations/log-in.svg')} alt="Illustration" />
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
                                        message: i18next.t("auth.login.errors.empty_email")
                                    }
                                ]}
                            >
                                <Input
                                    prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder={i18next.t("auth.login.email")}
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: i18next.t("auth.login.errors.empty_password")
                                    }
                                ]}
                            >
                                <Input
                                    prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder={i18next.t("auth.login.password")}
                                />
                            </Form.Item>

                            <Form.Item name="remember" valuePropName="checked">
                                <Checkbox>{i18next.t("auth.login.remember_me")}</Checkbox>
                            </Form.Item>

                            <Link className="login-form-forgot" to={`${path}forgot`}>{i18next.t("auth.login.forgot_password")}</Link>

                            <br />

                            <Button
                                type="primary"
                                htmlType="submit"
                                className="login-form-button"
                                loading={loading}
                            >
                                {i18next.t("auth.login.log_in")}
                            </Button>

                            <br />

                            {i18next.t("auth.login.or")} <Link to={`${path}register`}>{i18next.t("auth.login.register_now")}</Link>
                        </Form>

                    </motion.div>
                    <motion.div 
                        className="ushell-login-bottom-navigation"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5}}
                    >
                        <ul>
                            <li><a href="http://untill.com" target="_blank" rel="noopener noreferrer">{i18next.t("auth.login.homepage")}</a></li>
                            <li><a href="/" target="_blank" rel="noopener noreferrer">{i18next.t("auth.login.knowledge_base")}</a></li>
                            <li><a href="/" target="_blank" rel="noopener noreferrer">{i18next.t("auth.login.app_store")}</a></li>
                            <li><a href="/" target="_blank" rel="noopener noreferrer">{i18next.t("auth.login.google_play")}</a></li>
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