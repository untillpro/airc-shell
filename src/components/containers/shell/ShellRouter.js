/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { PureComponent } from 'react';
import { Switch, Route } from 'react-router-dom';

import {
    IndexRoute,
    ProfileRotue,
    ApplicationRoute
} from './routes';

class ShellRouter extends PureComponent {
    componentDidUpdate() {
        console.log("ShellRouter component did update");
    }

    render() {
        return (
            <Switch>
                <Route path="/profile" component={ProfileRotue} />
                <Route path="/:application/:view" component={ApplicationRoute} />
                <Route path="/:application" component={ApplicationRoute} />
                <Route path="/" component={IndexRoute} />
            </Switch>
        );
    }
}

export default ShellRouter;