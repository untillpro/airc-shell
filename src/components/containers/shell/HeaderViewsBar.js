/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from "react-router-dom";

import {
    selectView
} from 'actions';

class HeaderApplicationsBar extends Component {
    constructor() {
       super();

       this.items = [];
       this.state = {
           outIndexes: []
       };
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize.bind(this));
        this.handleResize();
    }

    handleResize() {
        const { outIndexes } = this.state;
        if (this.ul && this.items) {
            let W = this.ul.offsetWidth;
            let w = 40;
            let out = [];

 
            this.items.forEach((node, index) => {
                w += node.offsetWidth;

                if (w > W) {
                    out.push(index);
                }
            });

            if (outIndexes.length !== out.length) {
                this.setState({
                    outIndexes: out
                });
            }
        }
    }

    renderDots(sub) {
        if (sub && sub.length > 0) {
            return (
                <li>
                    <span className="dots"> ... </span>

                    <div className="sub">
                        <ul>
                            {sub}
                        </ul>
                    </div>
                </li>
            );
        }
        return null;
    }

    render() {
        const { outIndexes } = this.state;
        const { VIEWS, application, lang } = this.props;

        let views = null;

        if (VIEWS && application && VIEWS[application]) {
            views = VIEWS[application];
        }

        if (views && _.size(views) > 0) {
            const list = [];
            const sub = [];

            this.items = [];
            
            Object.values(views).forEach((item, index) => {
                const listitem = (
                    <li key={item.code} ref={(r) => { if (r) this.items.push(r); }} >   
                        <NavLink 
                            to={`/${application}/${item.getCode()}`} 
                            activeClassName="active"
                        >
                            <span>{item.getName(lang)}</span>
                        </NavLink>
                    </li>
                );

                if (outIndexes && outIndexes.indexOf(index) >= 0) {
                    sub.push(listitem);
                } else {
                    list.push(listitem);
                }
            });

            return (
                <div className="ushell-header-views-bar">
                    <nav ref={(ref) => this.nav = ref}>
                        <ul ref={(ref) => this.ul = ref}>
                            {list}
                            {this.renderDots(sub)}
                        </ul>
                    </nav>
                </div>
            );
        }

        return null;
    }
}

HeaderApplicationsBar.propTypes = {
    VIEWS: PropTypes.object,
    application: PropTypes.string,
    lang: PropTypes.string,
};

const mapStateToProps = (state) => {
    const { currentLanguage, defaultLanguage } = state.ui;
    const { application } = state.shell;
    const { VIEWS } = state.cp;
    const { remoteApi } = state.context;

    return {
        lang: currentLanguage || defaultLanguage,
        VIEWS, 
        application,
        remoteApi
    };
};

export default connect(mapStateToProps, { selectView })(HeaderApplicationsBar);