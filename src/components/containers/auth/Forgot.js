/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import { Steps } from 'antd';
import i18next from 'i18next';

import * as STEPS from './forgot/';

import FloatingBackButton from 'components/common/FloatingBackButton';
import { dropForgotStep } from 'actions';

const { Step } = Steps;

const steps = [
    {
        title: () => i18next.t("auth.forgot.step_1"),
        content: STEPS.FirstStep,
    },
    {
        title: () => i18next.t("auth.forgot.step_2"),
        content: STEPS.SecondStep,
    },
    {
        title: () => i18next.t("auth.forgot.step_3"),
        content: STEPS.ThirdStep,
    }
];

class Forgot extends Component {
    constructor() {
        super();

        this._handleBackClick = this._handleBackClick.bind(this);
    }

    componentDidMount() {
        this.props.dropForgotStep();
    }

    _handleBackClick() {
        const { history } = this.props;

        history.goBack();
    }

    render() {
        const { current } = this.props;
        const ContentComponent = current !== null && current !== undefined ? steps[current].content : null;

        return (
            <div className="ushell-container flex">
                <div className="ushell-login-container forgot">
                    <div className="ushell-login-block paper">
                        <Steps current={current}>
                            {steps.map((item) => {  
                                const t = item.title()
                                return <Step key={t} title={t} />
                            })}
                        </Steps>

                        <div className="form-block-step-content">{ContentComponent ? <ContentComponent /> : null}</div>

                        <FloatingBackButton
                            onClick={this._handleBackClick}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { forgotStep } = state.auth;

    return {
        current: forgotStep
    };
};

export default connect(mapStateToProps, { dropForgotStep })(withRouter(Forgot));