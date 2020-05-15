/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Typography,
    Form,
    Input,
    Button,
    Icon
} from 'antd';
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
    }

    handleSubmit = e => {
        const { api } = this.props;

        e.preventDefault();

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    err: null,
                    loading: true
                });

                setTimeout(() => {
                    api.forgot(values)
                        .then((res) => {
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
            } else {
                this.setState({ err: null });
            }
        });
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
        const { getFieldDecorator } = this.props.form;

        return (
            <Form onSubmit={this.handleSubmit}>
                <div className='registration-text-block'>
                    <Text>{i18next.t('auth.forgot.enter_your_email_below')}</Text>
                </div>

                <Form.Item hasFeedback>
                    {getFieldDecorator('email', {
                        rules: [
                            {
                                type: 'email',
                                message: i18next.t('auth.forgot.errors.invalid_email'),
                            },
                            {
                                required: true,
                                message: i18next.t('auth.forgot.errors.empty_email')
                            }
                        ],
                    })(
                        <Input
                            prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder={i18next.t('auth.forgot.enter_email')}
                            size="large"
                        />,
                    )}
                </Form.Item>

                {this._renderError()}

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

const mapStateToProps = (state) => {
    const { api } = state.context;

    return {
        api
    };
};


const ForgotFirstStep = Form.create({ name: 'forgot' })(FirstStep);

export default connect(mapStateToProps, { forgotChangePassword, userShouldConfirm })(ForgotFirstStep);