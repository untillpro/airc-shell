/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Dropdown, Menu, Modal } from 'base/components';
import { Avatar } from 'antd';
import { doLogout } from 'actions';

class ShellHeaderUserButton extends Component {
    quit() {
        const { doLogout } = this.props;

        Modal.confirm({
          title: 'Do you realy want to quit?',
          content: 'When clicked the OK button, this dialog will be closed after 1 second',
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
                    General settings
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item>
                    Criteria sets
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item>
                    Password change
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item 
                    onClick={() => this.quit()}
                >
                    <Icon type="logout" />
                    Sign out
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
                    //onClick={() => this.props.doLogout()}
                >
                    <Avatar src={require('assets/img/user_stub.png')}/>
                </Button>
            </Dropdown>
        );
    }
}

export default connect(null, {
    doLogout
})(ShellHeaderUserButton);