/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import { Steps } from 'antd';
import i18next from 'i18next';

import * as STEPS from './register/';

import FloatingBackButton from 'components/common/FloatingBackButton';
import { dropRegisterStep } from 'actions/';

const { Step } = Steps;

const steps = [
    {
        title: () => i18next.t("auth.register.step_1"),
        content: STEPS.FirstStep,
    },
    {
        title: () => i18next.t("auth.register.step_2"),
        content: STEPS.SecondStep,
    },
    {
        title: () => i18next.t("auth.register.step_3"),
        content: STEPS.ThirdStep,
    },
];

class RegistrationForm extends Component {
    constructor() {
        super();

        this._handleBackClick = this._handleBackClick.bind(this);
    }

    componentDidMount() {
        this.props.dropRegisterStep();
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
                <div className="ushell-login-container register">
                    <div className="ushell-login-block paper">
                        <Steps current={current}>
                            {steps.map((item) => {
                                const t = item.title();

                                return <Step key={t} title={t} />;
                            })}
                        </Steps>

                        <div className="form-block-step-content">{ContentComponent ? <ContentComponent /> : null}</div>

                        <FloatingBackButton onClick={this._handleBackClick} />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { registerStep } = state.auth;

    return {
        current: registerStep
    };
};

export default connect(mapStateToProps, { dropRegisterStep })(withRouter(RegistrationForm));