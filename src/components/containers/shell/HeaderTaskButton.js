/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';

import { Badge, Button, BaseIcon } from 'base/components';

class HeaderTaskButton extends Component {
    render() {
        return (
            <Badge count={2}>
                <Button  shape="circle"  type="link">
                    <BaseIcon icon="icon-to-do" />
                </Button>
            </Badge>
        );
    }
}

export default HeaderTaskButton;