/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import _ from 'lodash';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from "react-router-dom";

import {
    selectModule
} from 'actions';

class HeaderApplicationsBar extends PureComponent {
    constructor() {
        super();
        
        this.items = [];
        this.state = {
            outIndexes: []
        };
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize.bind(this));
        setTimeout(this.handleResize.bind(this), 100);
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

    selectModule(code) {
        this.props.selectModule(code);
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
        const { applications } = this.props;
        
        if (_.size(applications) > 0) {
            const list = [];
            const sub = [];

            this.items = [];

            Object.values(applications).forEach((app, index) => {
                const listitem = (
                    <li ref={r => { if (r) this.items.push(r); }} key={app.getName()} >
                        <NavLink to={`/${app.getCode()}`} activeClassName="active">
                            {app.getName()}
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
                <div className="ushell-header-activity-bar">
                    <nav className="ushell-header-nav-activity-bar"  ref={(ref) => this.bar = ref}>
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
    selectModule: PropTypes.func.isRequired,
    applications: PropTypes.object,
};

const mapStateToProps = (state) => {
    const { APPS } = state.cp;

    return { 
        applications: APPS
    };
};

export default connect(mapStateToProps, { selectModule })(HeaderApplicationsBar);