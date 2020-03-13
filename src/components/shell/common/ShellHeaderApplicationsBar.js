/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    selectModule
} from 'actions';

class ShellHeaderApplicationsBar extends Component {
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
    
    componentWillMount() {
        window.removeEventListener("resize", this.handleResize.bind(this));
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
        const { applications, application } = this.props;
        
        if (_.size(applications) > 0) {
            const list = [];
            const sub = [];

            this.items = [];

            Object.values(applications).forEach((app, index) => {
                const listitem = (
                    <li 
                        className={application === app.getCode() ? 'active' : ''}
                        ref={r => {
                            if (r) this.items.push(r);
                        }}
                        key={app.getName()}
                    >
                        <a 
                            href={`/${app.getCode()}`}
                            onClick={(event) => {
                                event.preventDefault();
                                this.selectModule(app.getCode());
                                return false;
                            }}
                            title={app.getName()}
                        >
                            <span>{app.getName()}</span>
                        </a>
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

const mapStateToProps = (state) => {
    const { application } = state.shell;
    const { APPS } = state.cp;

    return { 
        applications: APPS, 
        application 
    };
};

export default connect(mapStateToProps, { selectModule })(ShellHeaderApplicationsBar);