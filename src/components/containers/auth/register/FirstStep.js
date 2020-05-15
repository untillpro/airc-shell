/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component, Fragment } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import i18next from 'i18next';
import * as Flags from 'assets/flags';

import {
    Modal,
    Form,
    Input,
    Empty,
    Select,
    Checkbox,
    Button
} from 'antd';

import PhoneCodes from 'const/phone_codes.json';
import Countries from 'const/countries.json';

import agreeementHTML from 'misc/PersonAgreement';
import { checkResponse } from 'utils/AuthHelpers';
import { registerConfirmCode, registrationDone } from 'actions';

const { Option } = Select;

const INIT_VALUES = {
    "email": "test@test.test",
    "password": "123asdASD#@$",
    "confirm": "123asdASD#@$",
    "country": "RUS",
    "phone": "9217747495",
    "agree": true
};

class RegistrationForm extends Component {
    constructor() {
        super();

        this.emailTimer = null;

        this.state = {
            err: null,
            showAgreement: false,
            isAgree: true,
            confirmDirty: false,
            autoCompleteResult: [],
            loading: false
        };
    }

    _onAgreementPress() {
        this.setState({
            showAgreement: true
        });
    }

    _agrementHandleOk() {
        this.setState({
            showAgreement: false,
            isAgree: true,
        });

        this.props.form.setFields({
            agree: {
                value: true,
                errors: [],
            },
        });
    }

    _agrementHandleCancel() {
        this.setState({
            showAgreement: false,
            isAgree: false,
        });

        this.props.form.setFields({
            agree: {
                value: false,
                errors: [],
            },
        });
    }

    _handleAgreeChange(event) {
        this.setState({
            isAgree: event.target.checked
        })
    }

    _renderCountries() {
        if (Countries != null && Countries.length > 0) {
            return _.map(Countries, (val, id) => {
                return <Option value={val.iso3} key={id}>{val.name}</Option>
            });
        }

        return <Empty />;
    }

    handleSubmit = e => {
        const { api } = this.props;

        e.preventDefault();

        this.setState({
            loading: true,
            err: null
        });

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                api.register(values)
                    .then((res) => {
                        const r = checkResponse(res);

                        if (r === true) {
                            if (res.needConfirm === true) {
                                this.props.registerConfirmCode(
                                    res.email,
                                    res.token,
                                    res.tokenttl
                                );
                            } else {
                                this.props.registrationDone();
                            }
                        } else {
                            this.setState({ err: r, loading: false });
                        }
                    })
                    .catch((e) => {
                        this.setState({ err: e.message, loading: false });
                    });
            } else {
                this.setState({
                    err: null,
                    loading: false
                });
            }
        });
    };

    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback(i18next.t('auth.register.errors.not_equal_passwords'));
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;

        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }

        callback();
    };

    validateEmail = (rule, value, callback) => {
        const { api } = this.props;

        if (this.emailTimer) {
            clearTimeout(this.emailTimer);
        }

        if (value) {
            this.emailTimer = setTimeout(() => {
                api.isAvailable({ email: value })
                    .then((res) => {
                        const r = checkResponse(res);

                        if (r === true) {
                            callback();
                        } else {
                            callback(r);
                        }
                    })
                    .catch((e) => {
                        callback(e.message);
                    });
            }, 1000);
        } else {
            callback();
        }
    }

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
        const { showAgreement, isAgree, loading } = this.state;
        const { getFieldDecorator } = this.props.form;

        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '+1',
        })(
            <Select style={{ width: 110 }}>
                {_.map(PhoneCodes, (v, k) => {
                    return (
                        <Option value={v} key={k}>
                            <img className="option-phone-flag" src={Flags[k]} alt={k} />
                            <span className="option-phone-code">{v}</span>
                        </Option>
                    );
                })}
            </Select>,
        );

        return (
            <Fragment>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item label={i18next.t('auth.register.email')} hasFeedback>
                        {getFieldDecorator('email', {
                            initialValue: INIT_VALUES['email'],
                            rules: [
                                {
                                    required: true,
                                    message: i18next.t('auth.register.errors.empty_email'),
                                },
                                {
                                    validator: this.validateEmail
                                }
                            ],
                        })(<Input />)}
                    </Form.Item>

                    <Form.Item label={i18next.t('auth.register.password')} hasFeedback>
                        {getFieldDecorator('password', {
                            initialValue: INIT_VALUES['password'],
                            rules: [
                                {
                                    min: 6,
                                    max: 20,
                                    message: i18next.t('auth.register.errors.password_len_requirements')
                                },
                                {
                                    required: true,
                                    message: i18next.t('auth.register.errors.empty_password'),
                                },
                                {
                                    pattern: /((?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/,
                                    message: i18next.t('auth.register.errors.password_special_requirements'),
                                },
                                {
                                    validator: this.validateToNextPassword,
                                },
                            ],
                        })(
                            <Input.Password />
                        )}
                    </Form.Item>

                    <Form.Item label={i18next.t('auth.register.confirm_password')} hasFeedback>
                        {getFieldDecorator('confirm', {
                            initialValue: INIT_VALUES['confirm'],
                            rules: [
                                {
                                    required: true,
                                    message: i18next.t('auth.register.errors.empty_confirm_password'),
                                },
                                {
                                    validator: this.compareToFirstPassword,
                                },
                            ],
                        })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                    </Form.Item>

                    <Form.Item label={i18next.t('auth.register.country')}>
                        {getFieldDecorator('country', {
                            initialValue: INIT_VALUES['country'],
                            rules: [
                                {
                                    type: 'string',
                                    required: true,
                                    message: i18next.t('auth.register.errors.empty_country')
                                },
                            ],
                        })(<Select
                            showSearch
                            placeholder={i18next.t('auth.register.country')}
                            optionFilterProp="children"
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {this._renderCountries()}
                        </Select>)}
                    </Form.Item>

                    <Form.Item label={i18next.t('auth.register.phone_number')}>
                        {getFieldDecorator('phone', {
                            initialValue: INIT_VALUES['phone'],
                            rules: [{ required: true, message: i18next.t('auth.register.errors.empty_phone') }],
                        })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
                    </Form.Item>

                    <Form.Item {...tailFormItemLayout}>
                        {getFieldDecorator('agree', {
                            initialValue: INIT_VALUES['agree'],
                            rules: [{ required: true }]
                        })(
                            <Checkbox checked={isAgree} onChange={(val) => this._handleAgreeChange(val)}>
                                {i18next.t('auth.register.i_have_read')} <Button className="ant-link-button" onClick={() => this._onAgreementPress()} type="link" >{i18next.t('auth.register.licence_agreement')}</Button>
                            </Checkbox>,
                        )}
                    </Form.Item>

                    {this._renderError()}

                    <Form.Item {...tailFormItemLayout}>
                        <div className="submit-button centered">
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={!isAgree}
                                block
                                loading={loading}
                            >
                                {i18next.t('auth.register.step_1_submit')}
                            </Button>
                        </div>
                    </Form.Item>
                </Form>

                <Modal
                    width={720}
                    title={i18next.t('auth.register.terms_of_use')}
                    visible={showAgreement}
                    onOk={() => this._agrementHandleOk()}
                    onCancel={() => this._agrementHandleCancel()}
                >
                    <div className="content" dangerouslySetInnerHTML={{ __html: agreeementHTML }}></div>
                </Modal>
            </Fragment>
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

const FirstRegistrationStep = Form.create({ name: 'register' })(RegistrationForm);

const mapStateToProps = (state) => {
    const { api } = state.context;
    const { currentLanguage } = state.ui;

    return { api, currentLanguage };
}

export default connect(mapStateToProps, { registerConfirmCode, registrationDone })(FirstRegistrationStep);