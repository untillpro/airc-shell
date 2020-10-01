/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
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
    "prefix": "+1",
    "phone": "9217747495",
    "agree": true
};

class FirstRegistrationStep extends Component {
    constructor() {
        super();

        this.emailTimer = null;
        this.formRef = null;
        this.state = {
            err: null,
            showAgreement: false,
            isAgree: true,
            confirmDirty: false,
            autoCompleteResult: [],
            loading: false
        };

        this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
        this.agrementHandleOk = this.agrementHandleOk.bind(this);
        this.onAgreementPress = this.onAgreementPress.bind(this);
        this.agrementHandleCancel = this.agrementHandleCancel.bind(this);
        this.handleAgreeChange = this.handleAgreeChange.bind(this);
        this.handleFinish = this.handleFinish.bind(this);
        this.compareToFirstPassword = this.compareToFirstPassword.bind(this);
        this.validateToNextPassword = this.validateToNextPassword.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
    }

    onAgreementPress() {
        this.setState({
            showAgreement: true
        });
    }

    agrementHandleOk() {
        this.setState({
            showAgreement: false,
            isAgree: true,
        });

        if (this.formRef !== null) {
            this.formRef.current.setFieldsValue({
                agree: true
            });
        }
        /*
        this.props.form.setFields({
            agree: {
                value: true,
                errors: [],
            },
        });
        */
    }

    agrementHandleCancel() {
        this.setState({
            showAgreement: false,
            isAgree: false,
        });

        if (this.formRef !== null) {
            this.formRef.current.setFieldsValue({
                agree: false
            });
        }
        /*
        this.props.form.setFields({
            agree: {
                value: false,
                errors: [],
            },
        });
        */
    }

    handleAgreeChange(event) {
        this.setState({
            isAgree: event.target.checked
        })
    }

    handleFinish(values, err) {
        const { api } = this.props;

        if (!err) {
            this.setState({
                loading: true,
                err: null
            });


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

    };

    handleConfirmBlur(e) {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    //compareToFirstPassword(rule, value, callback) {
    async compareToFirstPassword(rule, value, ref) {
        console.log("compareToFirstPassword", ref);

        if (value && value !== ref.getFieldValue('password')) {
            return Promise.reject(i18next.t('auth.register.errors.not_equal_passwords'));
        }

        return Promise.resolve();
    };

    async validateToNextPassword(rule, value, ref) {
        console.log("Ref: ", ref);
        if (value && this.state.confirmDirty) {
            ref.validateFields(['confirm'], { force: true });
        }

        return Promise.resolve();
    };


    //TODO before production!
    async validateEmail(rule, value) {

        console.log('validateEmail', rule);
        const { api } = this.props;

        if (this.emailTimer) {
            clearTimeout(this.emailTimer);
        }

        if (value) {
            this.emailTimer = setTimeout(() => {
                api.isAvailable({ email: value })
                    .then((res) => {
                        console.log('api.isAvailable res: ', res);
                        const r = checkResponse(res);

                        if (r !== true) {
                            return 'Email not available';
                        }
                    })
                    .catch((e) => {
                        return e.toString();
                    });
            }, 1000);
        }
    }

    renderError() {
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

    renderCountries() {
        if (Countries != null && Countries.length > 0) {
            return _.map(Countries, (val, id) => {
                return <Option value={val.iso3} key={id}>{val.name}</Option>
            });
        }

        return <Empty />;
    }


    render() {
        const { showAgreement, isAgree, loading } = this.state;

        return (
            <Fragment>
                <Form
                    ref={this.formRef}
                    {...formItemLayout}
                    onFinish={this.handleFinish}
                    initialValues={{
                        email: INIT_VALUES['email'],
                        password: INIT_VALUES['password'],
                        confirm: INIT_VALUES['confirm'],
                        country: INIT_VALUES['country'],
                        prefix: INIT_VALUES['prefix'],
                        phone: INIT_VALUES['phone'],
                        agree: INIT_VALUES['agree']
                    }}
                >
                    <Form.Item
                        label={i18next.t('auth.register.email')}
                        name="email"
                        validateFirst
                        //hasFeedback
                        //validateStatus="validating"
                        rules={[
                            {
                                required: true,
                                message: i18next.t('auth.register.errors.empty_email'),
                            },
                            {
                                type: 'email',
                                message: i18next.t('auth.register.errors.wrong_email'),
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label={i18next.t('auth.register.password')}
                        name="password"
                        rules={[
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
                            (ref) => ({
                                validator: (rule, value) => this.validateToNextPassword(rule, value, ref),
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label={i18next.t('auth.register.confirm_password')}
                        name="confirm"
                        rules={[
                            {
                                required: true,
                                message: i18next.t('auth.register.errors.empty_confirm_password'),
                            },
                            (ref) => ({
                                validator: (rule, value) => this.compareToFirstPassword(rule, value, ref),
                            }),

                        ]}
                    >
                        <Input.Password onBlur={this.handleConfirmBlur.bind(this)} />
                    </Form.Item>

                    <Form.Item
                        label={i18next.t('auth.register.country')}
                        name="country"
                        rules={[
                            {
                                type: 'string',
                                required: true,
                                message: i18next.t('auth.register.errors.empty_country')
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            placeholder={i18next.t('auth.register.country')}
                            optionFilterProp="children"
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {this.renderCountries()}
                        </Select>
                    </Form.Item>


                    <Form.Item label={i18next.t('auth.register.phone_number')}>
                        <Input.Group compact>
                            <Form.Item
                                name="prefix"
                                rules={[{ required: true, message: i18next.t('auth.register.errors.empty_phone') }]}
                            >
                                <Select
                                    style={{ width: 110 }}
                                    onChange={this.handlePrefixChange}
                                >
                                    {_.map(PhoneCodes, (v, k) => {
                                        return (
                                            <Option value={v} key={k}>
                                                <img className="option-phone-flag" src={Flags[k]} alt={k} />
                                                <span className="option-phone-code">{v}</span>
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name={"phone"}
                                rules={[{ required: true, message: i18next.t('auth.register.errors.empty_phone') }]}
                            >
                                <Input style={{ width: '100%' }} />
                            </Form.Item>
                        </Input.Group>
                    </Form.Item>

                    <Form.Item
                        {...tailFormItemLayout}
                        name="agree"
                        rules={[{ required: true }]}
                    >
                        <Checkbox checked={isAgree} onChange={this.handleAgreeChange}>
                            {i18next.t('auth.register.i_have_read')} <Button className="ant-link-button" onClick={this.onAgreementPress} type="link" >{i18next.t('auth.register.licence_agreement')}</Button>
                        </Checkbox>
                    </Form.Item>

                    {this.renderError()}

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
                    onOk={this.agrementHandleOk}
                    onCancel={this.agrementHandleCancel}
                >
                    <div className="content" dangerouslySetInnerHTML={{ __html: agreeementHTML }}></div>
                </Modal>
            </Fragment >
        );
    }
}

FirstRegistrationStep.propTypes = {
    api: PropTypes.object,
    registerConfirmCode: PropTypes.func,
    registrationDone: PropTypes.func,
};

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

const mapStateToProps = (state) => {
    const { api } = state.context;
    const { currentLanguage } = state.ui;

    return { api, currentLanguage };
}

export default connect(mapStateToProps, { registerConfirmCode, registrationDone })(FirstRegistrationStep);