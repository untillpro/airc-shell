/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Dropdown, Menu, Modal } from 'base/components';
import { Avatar } from 'antd';
import { Link } from "react-router-dom";
//import Logger from 'base/classes/Logger';
import { doLogout } from 'actions';
import i18next from 'i18next';

class HeaderUserButton extends Component {
    quit() {
        const { doLogout } = this.props;

        Modal.confirm({
            title: i18next.t('shell.logout_title'),
            content: i18next.t('shell.logout_text'),
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
                        {i18next.t('shell.user_menu.general_settings')}
                    </Link>
                </Menu.Item>

                
                
                {/*
                <Menu.Divider />
                
                <Menu.Item>
                    {i18next.t('shell.user_menu.criteria_sets')}
                </Menu.Item>
                */}
                
                <Menu.Divider />

                <Menu.Item
                    onClick={() => this.quit()}
                >
                    <Icon type="logout" />
                    {i18next.t('shell.user_menu.sign_out')}
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
                    <Avatar src={require('assets/img/user_stub.png')} />
                </Button>
            </Dropdown>
        );
    }
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