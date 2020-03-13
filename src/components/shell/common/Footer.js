/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';

class Footer extends Component {
    render () {
        return (
            <div className="ushell-footer">
                <div className="content-container ushell-footer-container">
                    <div className="ushell-footer-left">
                        &copy; <span id="dateyear"></span> Untill. All rights reserved.
                    </div>
                    <div className="ushell-footer-right">
                        unTill Web Managment
                    </div>
                </div>
            </div>
        );
    }
}

export default Footer;