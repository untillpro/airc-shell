/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { ArrowLeftOutlined} from '@ant-design/icons'
import { motion } from "framer-motion";

export default class FloatingBackButton extends PureComponent {
    _onClick() {
        const { onClick } = this.props;
        
        if (onClick && typeof onClick === 'function') {
            onClick()
        }
    }

    render() {
        return (
            <motion.div 
                className="state-back-button"
                initial={{scale: 0}}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
            >
                <Button
                    key="back-button"
                    onClick={() => this._onClick()}
                    type="primary"
                    shape="circle"
                    icon={<ArrowLeftOutlined />}
                    size='large'
                />
            </motion.div>
        );
    }
}

FloatingBackButton.propTypes = {
    onClick: PropTypes.func,
};