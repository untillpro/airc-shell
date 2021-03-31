/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router";
import { Result, Button } from 'antd';
import { translate as t } from 'airc-shell-core';

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
        title={t('Successful registration', 'auth.register')}
        subTitle={t('You can start managing you account', 'auth.register')}
        extra={[
          <Button
            type="primary"
            key="start"
            onClick={this._handlePress}
          >
            {t("Let's start", 'auth.register')}
          </Button>
        ]}
      />
    );
  }
}

ThirdStep.propTypes = {
  history: PropTypes.object
};

export default withRouter(ThirdStep);