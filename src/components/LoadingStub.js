/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Loader from 'assets/img/loader.gif';

class LoadingStub extends Component {
    render () {
        const { loading } = this.props;

        if(loading) {
            return (
                <div className="ushell-loading-stub">
                    <div className="ushell-loading-stub-loader">
                        <img src={Loader} alt=""/>
                    </div>
                </div>
            );
        }

        return null;
    }
}

const mapStateToProps = (state) => {
    const { loading } = state.shell;

    return { loading };
};

LoadingStub.propTypes = {
    loading: PropTypes.bool
};

export default connect(mapStateToProps, null)(LoadingStub);