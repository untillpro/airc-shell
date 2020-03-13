/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

class LoadingStub extends Component {
    render () {
        const { loading } = this.props;

        if(loading) {
            return (
                <div className="ushell-loading-stub">
                    <div className="ushell-loading-stub-loader">
                        <img src={require("assets/img/loader.gif")} alt=""/>
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

export default connect(mapStateToProps, null)(LoadingStub);