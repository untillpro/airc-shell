/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import * as Notifications from 'const/notifications.js';

import cn from 'classnames';

class NotificationItem extends Component {
    constructor() {
        super();

        this.state = {
            opened: false,
            closed: false
        };

        this.timer = null;
    }

    componentDidMount() {
        this.onBlur();

        if (this.props.opened) {
            this.setState({opened: true});
        }
    }

    onHover() {
        if (this.timer) clearTimeout(this.timer);
    }

    onFocus() {
        if (this.timer) clearTimeout(this.timer);
    }

    onBlur() {
        const { hideClose, lifetime } = this.props;
        let ttl = lifetime;

        if (!ttl && hideClose) {
            ttl = 10;
        }

        if (this.timer) clearTimeout(this.timer);

        if (ttl && ttl > 0) {
            this.timer = setTimeout(() => {
                this.handleClose()
            }, ttl * 1000);
        }
    }

    toggleDetails() {
        const { opened } = this.state;

        this.setState({opened: !opened});
    }

    handleClose() {
        const { id, onRemove } = this.props;

        if (id && id > 0) onRemove(id);
    }

    handleItemPress() {
        const { description } = this.props;

        if (description) {
            this.toggleDetails();
        } else {
            this.handleClose();
        }
    }

    renderIcon () {
        return (
            <div className="notification_item_icon">
                <i className={this.getIconClass()} />
            </div>
        );
    }

    renderText() {
        const { text } = this.props;

        return (
            <div className="notification_item_text">
                {String(text)} 
            </div>
        );
    }

    renderCloseButton() {
        const {hideClose, lifetime} = this.props;

        if (hideClose && !lifetime) return null;

        return (
            <div 
                className="notification_item_close"
                onClick={() => this.handleClose()}
            >
                <i className="icon-cross" />
            </div>
        );
    }

    renderDetailsButton() {
        const { description } = this.props;
        const { opened } = this.state;

        if (description) {
            return (
                <div 
                    className="btn bordered"
                    onClick={this.toggleDetails.bind(this)}
                >
                    {opened ? 'Hide' : 'Details'}
                </div>
            );
        }

        return null;
    }

    renderButtons() {
        return (
            <div className="notification_item_buttons">
                
                {this.renderDetailsButton()}
                {this.renderCloseButton()}
            </div>
        );
    }

    renderDescription() {
        const { opened } = this.state;
        const { description } = this.props;


        if (description && opened) {
            return (
                <div className="notification_item_description">
                    {String(description)}
                </div>
            );
        }

        

        return null;
    }

    getIconClass() {
        let { type } = this.props;
        let res = '';

        switch (type) {
            case Notifications.ERROR: res = 'icon-close-solid'; break;
            case Notifications.WARNING: res = 'icon-alert'; break;
            case Notifications.INFO: res = 'icon-info-solid'; break;
            case Notifications.SUCCESS: res = 'icon-success'; break;

            default: res = 'icon-info-solid';
        }

        return res;
    }

    getStyle() {
        const { type } = this.props;
        let res;

        switch (type) {
            case Notifications.ERROR: res = 'error'; break;
            case Notifications.WARNING: res = 'warning'; break;
            case Notifications.INFO: res = 'info'; break;
            case Notifications.SUCCESS: res = 'success'; break;

            default: res = 'info';
        }


        return res;
    }

    render() {
        const { text, description } = this.props; 
        
        if(text || description) {
            return (
                <div 
                    className={cn(["notification_item", this.getStyle()])}
                    onMouseOver={this.onHover.bind(this)}
                    onMouseOut={this.onBlur.bind(this)}
                    onFocus={this.onFocus.bind(this)}
                    onClick={this.handleItemPress.bind(this)}
                >
                    <div className="notification_item_body">
                        {this.renderIcon()}

                        {this.renderText()}

                        {this.renderButtons()}
                    </div>

                    {this.renderDescription()}
                </div>
            );
        }

        return null;
    }
}

export default NotificationItem;