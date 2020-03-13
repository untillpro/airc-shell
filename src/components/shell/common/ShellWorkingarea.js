/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';

import {
    iframeLoadingFinished
} from 'actions';

class ShellWorkingarea extends Component {
    constructor() {
        super();

        this.iframe = null;

        this.state = {
            loaded: false,
            path: null
        };
    }

    componentDidMount() {
        this.setState({
            path: this.getPath(this.props)
        });
    }
    
    componentWillReceiveProps(newProps) {
        const { view, application } = this.props;

        if (newProps.application !== application || newProps.view !== view) {
            const path = this.getPath(newProps);

            this.setState({
                loaded: path === this.state.path,
                path
            });
        }
    }
    
    getPath(props) {
        const { view, application, manifest } = props;
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

        console.log('path is: ', path);

        return path;
    }

    onLoad() {
        //this.props.iframeLoadingFinished();

        this.setState({
            loaded: true
        });
    }

    render () {
        const { loaded, path } = this.state;

        return (
            <div className="ushell-working-area">
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
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { application, view, manifest } = state.shell;

    return { application, view, manifest };
};

export default connect(mapStateToProps, { 
    iframeLoadingFinished
})(ShellWorkingarea);