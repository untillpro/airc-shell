/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    selectView
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
        this.handleResize();
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
  
    selectView(code) {
        this.props.selectView(code);
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
        const { VIEWS, application, view } = this.props;

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
                    <li 
                        key={item.code}
                        className={item.getCode() === view ? 'active' : ''}
                        ref={(r) => {
                            if (r) this.items.push(r);
                        }}
                    >
                        <a 
                            href={`/${application}/${item.getCode()}`} 
                            onClick={(event) => {
                                event.preventDefault();
                                this.selectView(item.getCode());
                                return false;
                            }}
                        >
                            <span>{item.getName()}</span>
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

const mapStateToProps = (state) => {
    const { application, view } = state.shell;
    const { VIEWS } = state.cp;

    return {
        VIEWS, 
        view, 
        application 
    };
};

export default connect(mapStateToProps, { selectView })(ShellHeaderApplicationsBar);