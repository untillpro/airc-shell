/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    Form,
    Input,
    Button
} from 'antd';
import { translate as t } from 'airc-shell-core';
import { checkResponse } from 'utils/AuthHelpers';
import { resetPasswordSuccess } from 'actions';

const INIT_VALUES = {
    'token': '',
    'password': '',
    'confirm': '',
};

class SecondStep extends Component {
    constructor() {
        super();

        this.state = {
            loading: false,
            err: null,
            confirmDirty: false,
            autoCompleteResult: [],
        };

        this.formRef = null;
    }


    handleSubmit(e) {
        const { api } = this.props;

        e.preventDefault();

        if (!this.formRef) return;

        this.formRef.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    err: null,
                    loading: true
                });

                setTimeout(() => {
                    api.reset(values)
                        .then((res) => {
                            const r = checkResponse(res);

                            if (r === true) {
                                this.props.resetPasswordSuccess();
                            } else {
                                this.setState({ err: r, loading: false });
                            }
                        })
                        .catch((e) => {
                            this.setState({ err: e.message, loading: false });
                        });
                }, 1000);
            } else {
                this.setState({ err: null });
            }
        });
    };

    handleConfirmBlur(e) {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword(rule, value, callback) {
        if (value && value !== this.formRef.getFieldValue('password')) {
            callback(t('Two passwords that you enter is inconsistent', 'auth.forgot.errors'));
        } else {
            callback();
        }
    };

    validateToNextPassword(rule, value, callback) {
        if (value && this.state.confirmDirty) {
            this.formRef.validateFields(['confirm'], { force: true });
        }

        callback();
    };

    _renderError() {
        const { err } = this.state;

        if (err) {
            return (
                <div className='registration-text-block err'>
                    {err}
                </div>
            );
        }

        return null;
    }

    render() {
        const { loading } = this.state;

        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit.bind(this)} ref={this.formRef}>
                <Form.Item
                    label="Token"
                    name="token"
                    hasFeedback
                    initialValue={INIT_VALUES['token']}
                    rules={[
                        {
                            required: true,
                            message: t('Please enter token', 'auth.forgot.errors'),
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t('Password', 'auth.forgot')}
                    name="password"
                    hasFeedback
                    initialValue={INIT_VALUES['password']}
                    rules={[
                        {
                            min: 6,
                            max: 20,
                            message: t('password_len_requirements', 'auth.forgot.errors', { min: 6, max: 20 })
                        },
                        {
                            required: true,
                            message: t('Please input your password', "auth.forgot.errors"),
                        },
                        {
                            pattern: /((?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/,
                            message: t('Password format error', "auth.forgot.errors"),
                        },
                        {
                            validator: this.validateToNextPassword,
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label={t('Confirm Password', "auth.forgot")}
                    name="confirm"
                    hasFeedback
                    initialValue={INIT_VALUES['confirm']}
                    rules={[
                        {
                            required: true,
                            message: t('Please confirm your password', 'auth.forgot.errors'),
                        },
                        {
                            validator: this.compareToFirstPassword,
                        },
                    ]}
                >
                    <Input.Password onBlur={this.handleConfirmBlur} />
                </Form.Item>


                {this._renderError()}

                <Form.Item {...tailFormItemLayout}>
                    <div className="submit-button centered">
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                        >
                            {t('Reset password', 'auth.forgot')}
                        </Button>
                    </div>
                </Form.Item>
            </Form >
        );
    }
}

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 24,
            offset: 0,
        },
    },
};

SecondStep.propTypes = {
    api: PropTypes.object.isRequired,
    resetPasswordSuccess: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    const { api } = state.context;

    return {
        api
    };
};

export default connect(mapStateToProps, { resetPasswordSuccess })(SecondStep);
