/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    Typography,
    Form,
    Input,
    Button
} from 'antd';
import { MailOutlined } from '@ant-design/icons';
import i18next from 'i18next';
import { checkResponse } from 'utils/AuthHelpers';
import { forgotChangePassword, userShouldConfirm } from 'actions/';

const { Text } = Typography;

class FirstStep extends Component {
    constructor() {
        super();

        this.state = {
            err: '',
            loading: false
        };

        this.formRef = null;
        this.onFinish = this.onFinish.bind(this);
    }

    onFinish(values) {
        const { api } = this.props;

        this.setState({
            err: null,
            loading: true
        });

        setTimeout(() => {
            api.forgot(values)
                .then((res) => {
                    console.log("forgot res: ", res);
                    
                    const r = checkResponse(res);

                    if (r === true) {
                        if (res.confirmed === true) {
                            this.props.forgotChangePassword(
                                res.email,
                                res.ttl
                            );
                        } else {
                            this.props.userShouldConfirm(
                                res.email,
                                res.token,
                                res.ttl
                            );
                        }
                    } else {
                        this.setState({ err: r, loading: false });
                    }
                })
                .catch((e) => {
                    this.setState({ err: e.message, loading: false });
                });
        }, 1000);

    };

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

    render() {
        const { loading } = this.state;

        return (
            <Form 
                onFinish={this.onFinish}
                name="forgot"
            >
                <div className='registration-text-block'>
                    <Text>{i18next.t('auth.forgot.enter_your_email_below')}</Text>
                </div>

                <Form.Item
                    name="email"
                    hasFeedback
                    rules={[
                        {
                            type: 'email',
                            message: i18next.t('auth.forgot.errors.invalid_email'),
                        },
                        {
                            required: true,
                            message: i18next.t('auth.forgot.errors.empty_email')
                        }
                    ]}
                >
                    <Input
                        prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder={i18next.t('auth.forgot.enter_email')}
                        size="large"
                    />
                </Form.Item>

                {this.renderError()}

                <Form.Item>
                    <div className="submit-button centered">
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                        >
                            {i18next.t('auth.forgot.step_1_submit')}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        );
    }
}

FirstStep.propTypes = {
    api: PropTypes.object.isRequired,
    forgotChangePassword: PropTypes.func.isRequired,
    userShouldConfirm: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    const { api } = state.context;

    return {
        api
    };
};

export default connect(mapStateToProps, { forgotChangePassword, userShouldConfirm })(FirstStep);