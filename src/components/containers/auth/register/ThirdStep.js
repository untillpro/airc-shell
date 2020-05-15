/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import { withRouter } from "react-router";
import { Result, Button } from 'antd';
import i18next from 'i18next';

class ThirdStep extends Component {
  constructor() {
    super();

    this._handlePress = this._handlePress.bind(this);
  }

  _handlePress() {
    const { history } = this.props;

    history.push(`/`);
  }

  render() {
    return (
      <Result
        status="success"
        title={i18next.t('auth.register.success_title')}
        subTitle={i18next.t('auth.register.success_text')}
        extra={[
          <Button
            type="primary"
            key="start"
            onClick={this._handlePress}
          >
            {i18next.t('auth.register.step_3_submit')}
          </Button>
        ]}
      />
    );
  }
}

export default withRouter(ThirdStep);