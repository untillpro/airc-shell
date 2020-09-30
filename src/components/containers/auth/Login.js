/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Checkbox } from 'antd';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";
import { withCookies } from 'react-cookie';
import i18next from 'i18next';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { userShouldConfirm, authUser } from 'actions';
import { checkResponse } from 'utils/AuthHelpers';
import { addShellErrorNotify } from 'actions';

class Login extends Component {
    constructor() {
        super();

        this.state = {
            error: null,
            firstTime: true,
            loading: false
        };
    }

    handleSubmit(e) {
        const { api } = this.props;
        
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                });

                api.auth(values)
                    .then((res) => this._handleResponse(res))
                    .catch((e) => {
                        this.setState({
                            loading: false,
                            error: e.toString()
                        });
                    });
            }
        });

    };

    _handleError(e) {
        this.setState({
            error: e
        });
    }

    _handleResponse(res) {
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
                    this._handleError(i18next.t('auth.login.errors.auth_presponse_malformder'));
                } else {
                    history.push(`${path}register`);
                    this.props.userShouldConfirm(email, token, ttl);
                }
            } else {
                e = r;
            }
        }

        this.setState({
            error: e,
            loading: false
        });
    }

    _renderError() {
        const { error } = this.state;

        if (!error) return null;

        this.props.addShellErrorNotify(error.toString());

        this.setState({
            error: null
        });
    }

    _renderWelcomeText() {
        const { visited } = this.props;

        if (visited === true) {
            return i18next.t("auth.login.hello_2");
        }

        return i18next.t("auth.login.hello_1");
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { path } = this.props.match;
        const { loading } = this.state;

        return (
            <div className="ushell-container flex">
                <div className="ushell-login-container">
                    <div className="ushell-login-block paper">
                        <div className="ushell-login-block-logo">
                            <img src={require('assets/img/logo-rounded.svg')} alt="Logo" />
                        </div>

                        <div className="ushell-login-block-title">
                            {this._renderWelcomeText()}

                        </div>

                        <div className="ushell-login-block-illustration">
                            <img src={require('base/images/Illustrations/log-in.svg')} alt="Illustration" />
                        </div>

                        <Form onSubmit={this.handleSubmit.bind(this)} className="login-form form-block">
                            <Form.Item>
                                {getFieldDecorator('email', {
                                    rules: [
                                        { 
                                            required: true, 
                                            message: i18next.t("auth.login.errors.empty_email")
                                        }
                                    ],
                                })(
                                    <Input
                                        prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }}/>}
                                        placeholder={i18next.t("auth.login.email")}
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('password', {
                                    rules: [
                                        { 
                                            required: true, 
                                            message: i18next.t("auth.login.errors.empty_password") 
                                        }
                                    ],
                                })(
                                    <Input
                                        prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }}/>}
                                        type="password"
                                        placeholder={i18next.t("auth.login.password")}
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('remember', {
                                    valuePropName: 'checked',
                                    initialValue: true,
                                })(<Checkbox>{i18next.t("auth.login.remember_me")}</Checkbox>)}

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
                            </Form.Item>

                            {this._renderError()}
                        </Form>

                    </div>
                    <div className="ushell-login-bottom-navigation">
                        <ul>
                            <li><a href="http://untill.com" target="_blank" rel="noopener noreferrer">{i18next.t("auth.login.homepage")}</a></li>
                            <li><a href="/" target="_blank" rel="noopener noreferrer">{i18next.t("auth.login.knowledge_base")}</a></li>
                            <li><a href="/" target="_blank" rel="noopener noreferrer">{i18next.t("auth.login.app_store")}</a></li>
                            <li><a href="/" target="_blank" rel="noopener noreferrer">{i18next.t("auth.login.google_play")}</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { api } = state.context;
    const { visited } = state.shell;

    return { api, visited };
};

const FormLogin = Form.create({ name: 'normal_login' })(Login);
const WrappedLogin = withCookies(withRouter(FormLogin));

export default connect(mapStateToProps, {
    userShouldConfirm,
    authUser,
    addShellErrorNotify
})(WrappedLogin);