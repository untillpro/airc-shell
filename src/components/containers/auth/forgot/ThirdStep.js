/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Result, Button } from 'antd';
import { withRouter } from "react-router";
import i18next from 'i18next';

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
                title={i18next.t('auth.forgot.success_title')}
                subTitle={i18next.t('auth.forgot.success_text')}
                extra={[
                    <Button
                        onClick={this.handleClick}
                        type="primary"
                        key="start"
                    >
                        {i18next.t('auth.forgot.step_3_submit')}
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