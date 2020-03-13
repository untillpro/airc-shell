/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    selectModule,
    selectView
} from 'actions';

import ShellHeaderViewsBar from './ShellHeaderViewsBar';
import ShellHeaderApplicationsBar from './ShellHeaderApplicationsBar';

import ShellHeaderTaskButton from './ShellHeaderTaskButton';
import ShellHeaderNotifyButton from './ShellHeaderNotifyButton';
import ShellHeaderUserButton from './ShellHeaderUserButton';

class ShellHeader extends Component {
    
    render() {
        return (
            <div className="ushell-header">
                <div className="content-container ushell-header-container">
                    <div className="ushell-header-logo">
                        <a href="index.html">
                            <img src={require('assets/img/logo.svg')} alt="logo"/>
                        </a>
                    </div>
                    <div className="ushell-header-nav">
                        <div className="ushell-header-action-pane">
                            <ShellHeaderTaskButton />
                            <ShellHeaderNotifyButton />
                            <ShellHeaderUserButton />
                        </div>

                        <ShellHeaderApplicationsBar />

                        <div className="clear"></div>
                    </div>

                    <ShellHeaderViewsBar />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { manifest, module, view } = state.shell;

    return { manifest, module, view };
}

export default connect(mapStateToProps, {
    selectModule,
    selectView
})(ShellHeader);