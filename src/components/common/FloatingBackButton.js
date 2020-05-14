/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { PureComponent } from 'react';
import { Button } from 'antd';

export default class FloatingBackButton extends PureComponent {
    _onClick() {
        const { onClick } = this.props;
        
        if (onClick && typeof onClick === 'function') {
            onClick()
        }
    }

    render() {
        return (
            <div className="state-back-button">
                <Button
                    key="back-button"
                    onClick={() => this._onClick()}
                    type="primary"
                    shape="circle"
                    icon="arrow-left"
                    size='large'
                />
            </div>
        );
    }
}