/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import _ from 'lodash';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import {
    selectView,
    selectPlugin,
    setApplicationPath
} from 'actions';

import Logger from 'base/classes/Logger';

class ApplicationRoute extends Component {
    shouldComponentUpdate(newProps, newState) {
        const { application, view } = newProps.match.params;

        if (application !== this.props.application || view !== this.props.view) {
            this.props.selectPlugin( application, view );

            return true;
        }

        if (newState.loaded !== this.state.loaded || newState.path !== this.state.path) {
            return true;
        }

        if (newProps.path !== this.props.path || newProps.remoteApi !== this.props.remoteApi) {
            return true;
        }

        return false;
    }

    constructor() {
        super();

        this.iframe = null;

        this.state = {
            loaded: false
        };
    }

    componentDidMount() {
        const path = this.getPath();

        this.props.setApplicationPath(path);
    }
    
    componentDidUpdate(oldProps) {
        const { view, application, remoteApi, path } = this.props;

        Logger.debug({view, application, remoteApi}, 'Application router componentDidUpdate: ');

        if (oldProps.application !== application || oldProps.view !== view) {
            const newPath = this.getPath();
            console.log('newPath', newPath, path);
            if (path !== newPath) {
                this.props.setApplicationPath(newPath);

                this.setState({ loaded: true });
            }
        }

        if (
            remoteApi && 
            ((remoteApi !== oldProps.remoteApi) || ( view !== oldProps.view))
        ) {
            this.selectView(view);
        }
    }
    
    selectView(code) {
        const { remoteApi } = this.props;

        this.props.selectView(code);

        if (remoteApi && remoteApi.selectView && typeof remoteApi.selectView === 'function') {
            remoteApi.selectView(code);
        }
    }

    getPath() {
        const { view, application, manifest } = this.props;
        let path = null;
        let apps = null;

        if (manifest && application) {
            apps = Object.values(manifest);

            if (apps && apps.length > 0) {
                _.each(apps, (app) => {
                    if (app && app.code && app.code === application) {
                        path = app.path || null;

                        if (view && app.views && app.views.length > 0) {
                            _.each(app.views, (v) => {
                                if (v && v.code === view && v.path) {
                                    path = v.path || app.path || null;
                                }
                            });
                        }

                        return true;
                    }
                });
            }
        }

        return path;
    }

    onLoad() {
        const { remoteApi, view } = this.props;

        Logger.debug({remoteApi, view},'Loading finished');
        
        this.setState({ loaded: true });
    }

    render () {
        const { path } = this.props;
        const { loaded } = this.state;

        Logger.debug(path, 'Iframe path');

        return (
            <Fragment>
                { path ? (
                    <iframe 
                        id="plugin-manager"
                        src={path} 
                        className="ushell-working-area-iframe" 
                        onLoad={(evt) => this.onLoad(evt)} 
                        ref={ref => this.iframe = ref}
                        title="plugin-manager"
                        scrolling="maybe"
                    />
                ) : null}

                { !loaded ? (
                    <div className="ushell-working-area-loading">
                        <Spin />
                    </div>
                ) : null }
            </Fragment>
        );
    }
}

ApplicationRoute.propTypes = {
    path: PropTypes.string,
    remoteApi: PropTypes.object,
    application: PropTypes.string,
    view: PropTypes.string,
    manifest: PropTypes.object,
    selectView: PropTypes.func,
    selectPlugin: PropTypes.func, 
    setApplicationPath: PropTypes.func,
};

const mapStateToProps = (state) => {
    const { application, view, manifest } = state.shell;
    const { remoteApi, applicationPath: path } = state.context;

    return { application, view, manifest, remoteApi, path };
};

export default connect(mapStateToProps, { 
    selectView,
    selectPlugin, 
    setApplicationPath,
    
 })(ApplicationRoute);