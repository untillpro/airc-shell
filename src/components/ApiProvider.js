/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import { Component } from 'react';
import PropTypes from 'prop-types';
import iframeApi from '../base/modules/iframe-api';
import { connect } from 'react-redux';

import {
    ERROR,
    INFO,
    WARNING,
    SUCCESS
} from 'const/notifications';

import {
    addShellNotifyMessage,
    onModuleLoad,
    setRemoteApi
} from 'actions';

import URemoteAPIGate from 'base/classes/URemoteAPIGate';
import Logger from 'base/classes/Logger';

class ApiProvider extends Component {
    constructor(props) {
        super(props);

        this.API = {
            do: (queueId, path, params, method) => this._invokeApiMethod('invoke', queueId, path, params, method),
            sendError: (text, descr, lifetime, hideClose) => this._sendNotify(text, descr, ERROR, lifetime, hideClose),
            sendWarning: (text, descr, lifetime, hideClose) => this._sendNotify(text, descr, WARNING, lifetime, hideClose),
            sendSuccess: (text, descr, lifetime, hideClose) => this._sendNotify(text, descr, SUCCESS, lifetime, hideClose),
            sendInfo: (text, descr, lifetime, hideClose) => this._sendNotify(text, descr, INFO, lifetime, hideClose),
            moduleLoaded: (api) => this._onModuleLoaded(api),
            conf: (operations, wsids, timestamp, offset) => this._invokeApiMethod('conf', operations, wsids, timestamp, offset), //TODO
            collection: (type, wsids, entries, page, page_size, show_deleted) => this._invokeApiMethod('collection', type, wsids, entries, page, page_size, show_deleted), //TODO
            sync: (entries) => this._invokeApiMethod('sync', entries), //TODO
            log: (wsids, params) => this._invokeApiMethod('log', wsids, params), //TODO
        };
    }

    componentDidMount() {
        this._initApi();
    }

    componentDidUpdate(oldProps) {
        const { application } = this.props;

        if (application !== oldProps.application) {
            //this._initApi();
        }
    }

    _initApi() {
        try {
            iframeApi(this.API)
                .then((api) => {
                    console.log('Received remote api in shell: ', api);
                    if (api) {
                        this.props.setRemoteApi(new URemoteAPIGate(api));
                    }
                }, function (err) {
                    throw new Error('Shell error: Could not get iframe api', err);
                })
                .catch((e) => {
                    console.error("ApiProvider.iframeApi init error: ", e);
                });
        } catch (ex) {
            console.error("ApiProvider.iframeApi exception catched: ", ex);
        }
    }

    _getInitData() {
        const { rights, view } = this.props;

        return { rights, view };
    }

    _onModuleLoaded(api) {
        //TODO
        console.log('_onModuleLoaded() call', api);
        //this.props.onModuleLoad(api)
    }

    _sendNotify(txt, dscr, tp, lt, hc) {
        this.props.addShellNotifyMessage(txt, dscr, tp, lt, hc);
    }

    _invokeApiMethod(method, ...args) {
        const { api, token } = this.props;

        console.log('_invokeApiMethod', args);

        if (method && typeof method === 'string') {
            if (this.__isApiMethodExists(api, method)) {
                return api[method](token, ...args)
                    .catch((e) => {
                        console.error('_invokeApiMethod error:', e);
                        this._sendNotify(e, e, ERROR);
                    });
            }
        } else {
            Logger.error(method, 'Wrong method is given', 'ApiProvider._invokeApiMethod()');
        }

    }

    __isApiMethodExists(api, method) {
        if (api) {
            if (api[method] && typeof api[method] === 'function') {
                return true;
            } else {
                throw new Error(`Method "${method}" not implemented in current api`)
            }
        }

        throw new Error("API is not initialized");
    }

    render() {
        return this.props.children;
    }
}

ApiProvider.propTypes = {
    children: PropTypes.node,
    api: PropTypes.object,
    rights: PropTypes.object,
    application: PropTypes.string,
    view: PropTypes.string,
    token: PropTypes.string,
    addShellNotifyMessage: PropTypes.func,
    setRemoteApi: PropTypes.func,

};

const mapStateToProps = (state) => {
    const { api, applicationPath: path } = state.context;
    const { token, rights, application, view } = state.shell;

    return {
        api,
        path,
        token,
        rights,
        application,
        view
    };
}

export default connect(mapStateToProps, {
    addShellNotifyMessage,
    onModuleLoad,
    setRemoteApi
})(ApiProvider);