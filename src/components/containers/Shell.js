/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

//components

import {
    Header,
    ShellRouter
} from './shell/';

//actions

import {
    loadManifest,
    checkAuthToken
} from 'actions';

//config

import cfg from 'config.js';


class Shell extends PureComponent {
    constructor() {
        super();
        this.timer = null;
    }
    
    componentDidMount() {
        this.props.checkAuthToken(true);
        this.props.loadManifest()

        if (this.timer) clearInterval(this.timer);
        
        this.timer = setInterval(() => {
            this.props.checkAuthToken(false);
        }, cfg.CHECK_INTERVAL);
    }

    render() {
        const { appInit } = this.props;

        return (
            <div className="ushell-container">
                <Header />
                <div className="ushell-working-area">
                    { appInit ? (<ShellRouter />) : null}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { appInit } = state.ui;
    const { manifest, token, application, view } = state.shell;
    const { APPS, VIEWS } = state.cp; 

    return {
        appInit,
        APPS,
        VIEWS, 
        application,
        view,
        manifest, 
        token 
    };
};

Shell.propTypes = {
    checkAuthToken: PropTypes.func,
    loadManifest: PropTypes.func,
    appInit: PropTypes.bool
};

export default connect(mapStateToProps, { loadManifest, checkAuthToken })(Shell);