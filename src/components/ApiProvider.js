/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import { Component } from 'react';
import PropTypes from 'prop-types';
import iframeApi from '../base/modules/iframe-api';
//import iframeApi from 'iframe-api';
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
            blob: (wsids, params) => this._invokeApiMethod('log', wsids, params), //TODO
        };
    }

    componentDidMount() {
        this._initApi();
    }

    _initApi() {
        const onReceived = (api) => {
            Logger.log(api, 'Received remote api in shell: ');

            if (api) {
                this.remoteApi = new URemoteAPIGate(api);
                this.props.setRemoteApi(this.remoteApi);
            }
        }

        const onError = (err) => {
            Logger.error(err, "ApiProvider.iframeApi init error: ");
            //throw new Error('Shell error: Could not get iframe api', err);
        };
        
        try {
            iframeApi(this.API, onReceived, onError, { debug: true, name: "Air Shell" });
        } catch (ex) {
            Logger.error(ex, "ApiProvider.iframeApi exception catched: ");
        }
    }

    _payload() {
        const { ui, view } = this.props;
        const { availableLangs, defaultLanguage, currentLanguage } = ui;

        return {
            view,
            options: {
                defaultLanguage: availableLangs[defaultLanguage],
                currentLanguage: availableLangs[currentLanguage]
            }
        };
    }

    _getInitData() {
        const { rights, view } = this.props;

        return { rights, view };
    }

    _onModuleLoaded() {
        Logger.log('_onModuleLoaded() call');

        if (
            this.remoteApi &&
            this.remoteApi.init &&
            typeof this.remoteApi.init === "function"
        ) {
            this.remoteApi.init(this._payload());
        }
    }

    _sendNotify(txt, dscr, tp, lt, hc) {
        this.props.addShellNotifyMessage(txt, dscr, tp, lt, hc);
    }

    _invokeApiMethod(method, ...args) {
        const { api, token } = this.props;

        Logger.log(args, '_invokeApiMethod');

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
    ui: PropTypes.object

};

const mapStateToProps = (state) => {
    const { ui } = state;
    const { api, applicationPath: path } = state.context;
    const { token, rights, application, view } = state.shell;

    return {
        ui,
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