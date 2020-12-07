/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';

import {
    hideForgotModal
} from 'actions';

class ForgotPassword extends Component {
    handleClose() {
        this.props.hideForgotModal();
    }

    render() {
        return (
            <ReactModal
                isOpen
                portalClassName="ushell-modal-portal"
                overlayClassName="ushel-modal-overlay"
                className="ushell-modal-content large-modal"
                contentLabel="Reauth modal"
                shouldCloseOnOverlayClick
                shouldCloseOnEsc
                onRequestClose={this.handleClose.bind(this)}
            >
                <div className="">
                    Oops, your session has expired
                </div>

                <div className="">
                    <img src={require('base/images/Illustrations/expired-session.svg')} alt="forgot password"/>
                </div>

                <div className="">
                    Your session has expired and requests to the server has failed.<br />
                    Try signing in again below or close this popup to check your data and sign in later.
                </div>

            </ReactModal>
        );
    }
} 

ForgotPassword.propTypes = {
    hideForgotModal: PropTypes.func
}

export default connect(null, { hideForgotModal })(ForgotPassword);