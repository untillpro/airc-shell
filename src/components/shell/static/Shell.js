/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

//components

import {
    ShellHeader,
    ShellWorkingarea
} from 'components/shell/common/';

//actions

import {
    loadManifest,
    checkAuthToken
} from 'actions';

//config

import cfg from 'config.js';


class Shell extends Component {
    constructor() {
        super();
        this.timer = null;
    }

    componentWillReceiveProps(nextProps) {

    }

    componentWillMount() {
        this.props.checkAuthToken(true);
        this.props.loadManifest()

        if (this.timer) clearInterval(this.timer);
        
        this.timer = setInterval(() => {
            this.props.checkAuthToken(false);
        }, cfg.CHECK_INTERVAL);
    }

    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    onLoad() {
        return null;
    }

    render() {
        return (
            <div className="ushell-container">
                <ShellHeader />
                <ShellWorkingarea />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { manifest, token, application, view } = state.shell;
    const { APPS, VIEWS } = state.cp; 

    return {
        APPS,
        VIEWS, 
        application,
        view,
        manifest, 
        token 
    };
};

export default connect(mapStateToProps, { loadManifest, checkAuthToken })(Shell);