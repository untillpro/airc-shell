/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { NotificationItem } from 'components/common/';

import cn from 'classnames';

class NotificationsContainer extends Component {
    constructor() {
        super();

        this.state = {
            messages: {}
        };
    }

    componentDidUpdate(newProps) {
        const { notifications } = this.props;
        
        if (newProps.last && (this.props.last !== newProps.last)) {
            const { last,  } = newProps;

            const mess = notifications[last];

            if (mess) {
                this.addMessage(last, mess);
            }
        }
    }

    addMessage(key, value) {
        const { messages } = this.state;

        messages[key] = value;

        this.setState(messages);
    }

    removeMessage(key) {
        const { messages } = this.state;

        if (messages[key]) {
            delete messages[key];
        }

        this.setState(messages);
    }

    renderMessages() {
        const { messages } = this.state;

        if (messages) {
            const list = Object.values(messages);

            return list.map((item) => {
                return <NotificationItem 
                    key={`notification_item_${item.id}`}
                    {...item} 
                    onRemove={(id) => this.removeMessage(id)}                     
                />
            });
        }

        return null;
    }

    getClass() {
        const { right, bottom } = this.props;

        return `${right ? 'right' : 'left'} ${bottom ? 'bottom' : 'top'}`;
    }

    render() {
        return (
            <div className={cn("ushell-notifications-container", this.getClass())}>
                <ReactCSSTransitionGroup
                    transitionName="ushell-notifications-item"
                    transitionEnterTimeout={300}
                    transitionLeaveTimeout={300}
                >
                    {this.renderMessages()}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { notifications, last } = state.notify;

    return { notifications, last };
}; 

export default connect(mapStateToProps, )(NotificationsContainer);