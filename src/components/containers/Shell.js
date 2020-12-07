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
        console.log("Shell component did mount");
        this.props.checkAuthToken(true);
        this.props.loadManifest()

        if (this.timer) clearInterval(this.timer);
        
        this.timer = setInterval(() => {
            this.props.checkAuthToken(false);
        }, cfg.CHECK_INTERVAL);
    }

    componentDidUpdate() {
        console.log("Shell component did update");
    }
    
    render() {
        return (
            <div className="ushell-container">
                <Header />
                <div className="ushell-working-area">
                    <ShellRouter />
                </div>
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

Shell.propTypes = {
    checkAuthToken: PropTypes.func,
    loadManifest: PropTypes.func
};

export default connect(mapStateToProps, { loadManifest, checkAuthToken })(Shell);