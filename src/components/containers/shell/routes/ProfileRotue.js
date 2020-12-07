/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

class ProfileRotue extends PureComponent {
    render() {
        return (
            <div>
                Profile route
            </div>
        );
    };
}

export default connect()(ProfileRotue);