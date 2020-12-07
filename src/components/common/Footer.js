/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LangSelector from 'components/common/LangSelector';
import i18next from 'i18next';
import Logger from 'base/classes/Logger';

class Footer extends Component {
    shouldComponentUpdate(nextProps) {
        Logger.debug(nextProps, 'Props:', 'Footer.shouldComponentUpdate()');

        if (nextProps.currentLanguage !== this.props.currentLanguage) {
            return true;
        }

        return false;
    }

    render() {
        return (
            <div className="ushell-footer">
                <div className="content-container ushell-footer-container">
                    <div className="ushell-footer-left">
                        {i18next.t("shell.footer.copy", { year: new Date().getFullYear()})}
                    </div>
                    <div className="ushell-footer-center">
                        {i18next.t("shell.footer.version", { version: process.env.REACT_APP_VERSION})}
                    </div>
                    <div className="ushell-footer-right">
                        {i18next.t("shell.footer.managment")}

                        <div className="ushell-footer-lang-selector">
                            <LangSelector />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { currentLanguage } = state.ui;

    return {
        currentLanguage
    };
};

Footer.propTypes = {
    currentLanguage: PropTypes.string
};

export default connect(mapStateToProps, {})(Footer);