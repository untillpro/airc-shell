/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import IState from '../IState';

class StateRoot extends IState {
    GetName() {
        return 'StateRoot';
    }

    MessageInit(msg , context) {
        
    }
}

export default StateRoot;
