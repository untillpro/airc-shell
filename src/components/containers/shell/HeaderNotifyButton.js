/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { PureComponent } from 'react';
import { Badge, Button, BaseIcon } from 'base/components';

class HeaderNotifyButton extends PureComponent {
    render() {
        return (
            <Badge count={5}>
                <Button shape="circle"  type="link" >
                    <BaseIcon icon="icon-to-do" />
                </Button>
            </Badge>
        );
    }
}

export default HeaderNotifyButton;