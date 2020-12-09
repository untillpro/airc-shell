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

import * as STEPS from './forgot/';

import FloatingBackButton from 'components/common/FloatingBackButton';
import { dropForgotStep } from 'actions';

const { Step } = Steps;

const steps = [
    {
        title: () => t("E-mail", "auth.forgot"),
        content: STEPS.FirstStep,
    },
    {
        title: () => t("Set password", "auth.forgot"),
        content: STEPS.SecondStep,
    },
    {
        title: () => t("Done", "auth.forgot"),
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
                    <motion.div
                        className="ushell-login-block paper"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                    >
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
                    </motion.div>
                </div>
            </div>
        );
    }
}

Forgot.propTypes = {
    dropForgotStep: PropTypes.func.isRequired,
    history: PropTypes.object,
    current: PropTypes.string
};

const mapStateToProps = (state) => {
    const { forgotStep } = state.auth;

    return {
        current: forgotStep
    };
};

export default connect(mapStateToProps, { dropForgotStep })(withRouter(Forgot));