/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate as t } from 'airc-shell-core';
import { Modal, Avatar } from 'antd';
import { Link } from "react-router-dom";

import { Button, Dropdown, Menu } from 'base/components';
import { LogoutOutlined } from '@ant-design/icons';

import { doLogout } from 'actions';

import AvaImg from 'assets/img/user_stub.png';

class HeaderUserButton extends PureComponent {
    quit() {
        const { doLogout } = this.props;

        Modal.confirm({
            cancelText: t('Cancel', 'shell.buttons'),
            title: t('Do you realy want to quit?', 'shell'),
            content: t('When clicked the OK button, this dialog will be closed after 1 second', 'shell'),
            onOk: () => {
                doLogout();
                return false;
            },
            onCancel() {

            },
        });
    }

    renderMenu() {
        return (
            <Menu>
                <Menu.Item>
                    <Link to="/profile">
                        {t('General settings', 'shell.user_menu')}
                    </Link>
                </Menu.Item>

                {
                    /*
                    <Menu.Divider />
                    
                    <Menu.Item>
                        {t('Criteria sets', 'shell.user_menu')}
                    </Menu.Item>
                    */
                }
                
                <Menu.Divider />

                <Menu.Item
                    onClick={() => this.quit()}
                >
                    <LogoutOutlined />
                    {t('Sign out', 'shell.user_menu')}
                </Menu.Item>
            </Menu>
        );
    }

    render() {
        return (
            <Dropdown
                placement="bottomRight"
                overlay={this.renderMenu()}
            >
                <Button
                    shape="circle"
                    type="link"
                >
                    <Avatar src={AvaImg} />
                </Button>
            </Dropdown>
        );
    }
}

HeaderUserButton.propTypes = {
    doLogout: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
    const { currentLanguage } = state.ui;

    return {
        currentLanguage
    }
};

export default connect(mapStateToProps, {
    doLogout
})(HeaderUserButton);