/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Typography, Spin, Button } from 'antd';
import moment from 'moment';
import ReactCodeInput from 'react-code-input';
import { translate as t } from 'airc-shell-core';
import { registrationDone, registerConfirmCode } from 'actions';
import { checkResponse } from 'utils/AuthHelpers';

const { Text } = Typography;

class SecondStep extends Component {
    constructor() {
        super();

        this.state = {
            code: '',
            error: null,
            checking: false,
            counter: null,
            canResend: true,
            disabled: false
        };

        this.timer = null;
    }

    componentDidMount() {
        this._blockResend();

        this.timer = setInterval(() => this._tick(), 1000);
    }

    componentDidUpdate(oldProps) {
        const { token } = this.props;

        if (token !== oldProps.token) {
            this._blockResend();
        }
    }

    _blockResend() {
        const { timeBeforeResend } = this.props;

        this.setState({
            code: '',
            disabled: false,
            canResend: false,
            counter: timeBeforeResend
        });
    }

    _tick() {
        this._checkResend();
        this._checkTTL();
    }

    _checkResend() {
        const { counter } = this.state;

        const c = counter - 1;

        if (c <= 0) {
            this.setState({
                counter: 0,
                canResend: true
            });
        } else {
            this.setState({
                counter: c
            });
        }
    }

    _checkTTL() {
        const { disabled } = this.state;
        const { ttl } = this.props;
        const d = new Date().valueOf();

        if (ttl < d && !disabled) {
            this.setState({
                disabled: true,
                error: t('expired_token', 'auth.register.errors'),
                canResend: true
            })
        }
    }

    _resendCode() {
        const { api, email } = this.props;

        this.setState({
            error: null
        });

        api.resend({ email })
            .then((res) => {
                const r = checkResponse(res);

                if (r === true) {
                    this.props.registerConfirmCode(
                        email,
                        res.token,
                        res.tokenttl,
                    );
                } else {
                    this.setState({
                        error: r,
                    });
                }
            })
            .catch((e) => {
                this.setState({
                    error: e.message
                });
            });
    }

    _checkCode(code) {
        const { api, token } = this.props;

        api.confirm({ code, token })
            .then((res) => {
                const r = checkResponse(res);

                if (r === true) {
                    this.props.registrationDone();
                } else {
                    this.setState({
                        code: '',
                        error: r,
                        checking: false
                    });
                }
            })
            .catch((e) => {
                this.setState({
                    code: '',
                    error: e.message,
                    checking: false
                });
            });
    }

    _onCodeChange(val) {
        const { confirmLen } = this.props;
        const state = {};

        if (val.length === confirmLen) {
            state.checking = true;

            setTimeout(() => this._checkCode(val), 1000);
        }

        state.code = val;

        this.setState(state);
    }

    _renderError() {
        const { error } = this.state;

        if (error) {
            return (
                <div className='registration-text-block err'>
                    {error}
                </div>
            );
        }

        return null;
    }

    _renderResend() {
        const { canResend, counter } = this.state;

        if (canResend === true) {
            return (
                <div className='registration-text-block'>
                    <Button type="link" onClick={() => this._resendCode()}>
                        {t('Resend code', 'auth.register')}
                    </Button>
                </div>
            );
        }
        const d = new Date(counter * 1000);

        return (
            <div className='registration-text-block'>
                <Button type="link" disabled>
                    {t('Resend code', 'auth.register')} ({moment(d).format('mm:ss')})
                </Button>
            </div>
        );
    }


    render() {
        const { code, checking, disabled } = this.state;
        const { confirmLen, email } = this.props;

        const res = (
            <div>
                <div className='registration-text-block'>
                    <Text>{t('We just sent an e-mail on {{email}}', 'auth.register', { email })}</Text><br />
                    <Text>{t('Please enter code from e-mail in the fields below', 'auth.register')}</Text>
                </div>

                <div className='registration-code-input-block'>
                    <ReactCodeInput
                        disabled={disabled || checking}
                        type='text'
                        fields={confirmLen}

                        value={code}
                        onChange={(val) => this._onCodeChange(val)}
                    />
                </div>

                {this._renderError()}

                {this._renderResend()}
            </div>
        );

        if (checking) {
            return <Spin tip="Loading...">{res}</Spin>;
        }

        return res;
    }
}

const mapStateToProps = (state) => {
    const { api } = state.context;
    const { confirmLen, token, ttl, email, timeBeforeResend } = state.auth;

    return {
        email,
        api,
        confirmLen,
        token,
        ttl,
        timeBeforeResend
    };
};

SecondStep.propTypes = {
    token: PropTypes.string,
    timeBeforeResend: PropTypes.number,
    ttl: PropTypes.number,
    confirmLen: PropTypes.number,
    api: PropTypes.object, 
    email: PropTypes.string,
    registerConfirmCode: PropTypes.func,
    registrationDone: PropTypes.func,
};

export default connect(mapStateToProps, { registrationDone, registerConfirmCode })(SecondStep);