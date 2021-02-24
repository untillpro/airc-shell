/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from './Modal';
import { AuthForm } from 'components/forms';
import { hideAuthModal } from 'actions';

import ExpiredIllustration from 'base/images/Illustrations/expired-session.svg';

class Auth extends Component {
    handleRequestClose() {
        this.props.hideAuthModal();
    }

    render () {
        return (
            <Modal
                className="large-modal"
                contentLabel="Reauth modal"
                shouldCloseOnOverlayClick
                shouldCloseOnEsc
                onRequestClose={this.handleRequestClose.bind(this)}
            >
                <div className="ushell-modal-descrpition">
                    <div className="ushell-modal-header">
                        Oops, your session has expired
                    </div>

                    <div className="ushell-modal-descrpition">
                        <img src={ExpiredIllustration} alt="session has expired"/>
                    </div>

                    <div className="ushell-modal-text">
                        Your session has expired and requests to the server has failed.<br />
                        Try signing in again below or close this popup to check your data and sign in later.
                    </div>
                </div>

                <AuthForm />
            </Modal>
        );
    }
}

export default connect(null, { hideAuthModal })(Auth);