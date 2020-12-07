/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Modal from './Modal';
import { AuthForm } from 'components/forms';
import { hideAuthModal } from 'actions';

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
                        <img src={require('base/images/Illustrations/expired-session.svg')} alt="session has expired"/>
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

Auth.propTypes = {
    hideAuthModal: PropTypes.func
};

export default connect(null, { hideAuthModal })(Auth);