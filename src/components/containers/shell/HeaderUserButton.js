/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Dropdown, Menu } from 'base/components';
import { Modal, Avatar } from 'antd';
import { Link } from "react-router-dom";
//import Logger from 'base/classes/Logger';
import { doLogout } from 'actions';
import i18next from 'i18next';
import { LogoutOutlined } from '@ant-design/icons';

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
                    <LogoutOutlined />
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