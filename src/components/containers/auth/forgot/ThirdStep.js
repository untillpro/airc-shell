/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Result, Button } from 'antd';
import { withRouter } from "react-router";
import { translate as t } from 'airc-shell-core';

class ForgotThirdStep extends Component {
    constructor() {
        super();

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const { history } = this.props;

        history.push("/");
    }

    render() {
        return (
            <Result
                status="success"
                title={t('Password changed', 'auth.forgot')}
                subTitle={t('You can sign in with your new password', 'auth.forgot')}
                extra={[
                    <Button
                        onClick={this.handleClick}
                        type="primary"
                        key="start"
                    >
                        {t('step_3_submit', 'auth.forgot')}
                    </Button>
                ]}
            />
        );
    }
}

ForgotThirdStep.propTypes = {
    history: PropTypes.object.isRequired,
}

export default withRouter(ForgotThirdStep);