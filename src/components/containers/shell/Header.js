/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import {
    selectModule,
    selectView
} from 'actions';

import HeaderViewsBar from './HeaderViewsBar';
import HeaderApplicationsBar from './HeaderApplicationsBar';

//import HeaderTaskButton from './HeaderTaskButton';
//import HeaderNotifyButton from './HeaderNotifyButton';
import HeaderUserButton from './HeaderUserButton';

class Header extends Component {
    
    render() {
        return (
            <div className="ushell-header">
                <div className="content-container ushell-header-container">
                    <div className="ushell-header-logo">
                        <Link to="/">
                            <img src={require('assets/img/logo.svg')} alt="logo"/>
                        </Link>
                    </div>
                    <div className="ushell-header-nav">
                        <div className="ushell-header-action-pane">
                            {/*
                            <HeaderTaskButton />
                            <HeaderNotifyButton />
                            */}
                            <HeaderUserButton />
                        </div>

                        <HeaderApplicationsBar />

                        <div className="clear"></div>
                    </div>

                    <HeaderViewsBar />
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
})(Header);