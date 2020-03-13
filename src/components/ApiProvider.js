/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component, Fragment } from 'react';
import iframeApi from 'iframe-api';
import { connect } from 'react-redux';

import {
    ERROR,
    INFO,
    WARNING,
    SUCCESS
} from 'const/Notifications';

import {
    addShellNotifyMessage,
    changePath,
    onModuleLoad
} from 'actions';

import log from 'Log';
import UshellApi from 'classes/UshellApi';

global.API = null; // TODO: should think abou it. Temp solution!!!

class ApiProvider extends Component {
    componentDidMount() {
        const API = {
            do: (queueId, path, params, method) => this.invokeApi(queueId, path, params, method),
            sendError: (text, descr, lifetime, hideClose) => this.sendNotify(text, descr, ERROR, lifetime, hideClose),
            sendWarning: (text, descr, lifetime, hideClose) => this.sendNotify(text, descr, WARNING, lifetime, hideClose),
            sendSuccess: (text, descr, lifetime, hideClose) => this.sendNotify(text, descr, SUCCESS, lifetime, hideClose),
            sendInfo: (text, descr, lifetime, hideClose) => this.sendNotify(text, descr, INFO, lifetime, hideClose),
            onModuleLoad: () => this.props.onModuleLoad(),
            //changePath: (path) => this.props.changePath(path)
        };
        
        iframeApi(API)
            .then((api) => {
                log('---- received API in shell ApiProvider');
                log(api);
                global.API = api;
            });
    }

    sendNotify(txt, dscr, tp, lt, hc) {
        this.props.addShellNotifyMessage(txt, dscr, tp, lt, hc);
    }
    
    invokeApi(queueId, path, params, method) {
        const { token } = this.props;

        return UshellApi.invoke(queueId, path, token, params, method)
    }

    render() {
        log('ApiProvider rendered');

        return(
            <Fragment>
                {this.props.children}
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    const { token } = state.shell;

    return { token };
}


export default connect(mapStateToProps, { 
    addShellNotifyMessage,
    changePath,
    onModuleLoad
})(ApiProvider);