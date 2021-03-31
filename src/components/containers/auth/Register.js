/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import { Steps } from 'antd';
import { translate as t } from 'airc-shell-core';
import { motion } from "framer-motion";

import * as STEPS from './register/';

import FloatingBackButton from 'components/common/FloatingBackButton';
import { dropRegisterStep } from 'actions/';

const { Step } = Steps;

const steps = [
    {
        title: () => t("Personal info", "auth.register"),
        content: STEPS.FirstStep,
    },
    {
        title: () => t("Confirmation", "auth.register"),
        content: STEPS.SecondStep,
    },
    {
        title: () => t("Done", "auth.register"),
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
                    <motion.div 
                        className="ushell-login-block paper"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                    >
                        <Steps current={current}>
                            {steps.map((item) => {
                                const t = item.title();

                                return <Step key={t} title={t} />;
                            })}
                        </Steps>

                        <div className="form-block-step-content">{ContentComponent ? <ContentComponent /> : null}</div>

                        <FloatingBackButton onClick={this._handleBackClick} />
                    </motion.div>
                </div>
            </div>
        );
    }
}

RegistrationForm.propTypes = {
    current: PropTypes.string,
    history: PropTypes.object.isRequired,
    dropRegisterStep: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    const { registerStep } = state.auth;

    return {
        current: registerStep
    };
};

export default connect(mapStateToProps, { dropRegisterStep })(withRouter(RegistrationForm));