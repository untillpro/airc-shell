/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

export default class StateMachine {
    constructor(context = null) {
        this.stack = [];
        this.lastDetouchedBlas = null;
        this.context = context;
    }

    Add(state) {
        this.stack.push(state);
    }

    Delete(state) {
        if (state) {
            const index = this.stack.indexOf(state);

            if (index >= 0) {
                const arr = this.stack.splice(index, 1);

                arr.map(item => item.Detouch());
                this.lastDetouchedBlas = arr;

                return arr.length > 0;
            }
        }

        return false;
    }

    SendGlobalMessage(msg) {
        if (this.stack.length > 0) {
            for (let i = this.stack.length; i > 0; i--) {
                const state = this.stack[i - 1];

                if (state.CanAcceptMessage(msg)) {
                    return this.ProcessMessage(state, msg);
                }
            }
        }

        return false;
    }

    SendMessage(msg) {
        let data = {};

        data = this.SendMessageInternal(msg);

        return data;
    }

    SendMessageInternal(msg) {
        let state;

        const { stack } = this;
        const stackLength = stack.length;
        
        if (stackLength >= 1) {
            state = this.stack[stackLength - 1];

            if (state.CanAcceptMessage(msg)) {
                return this.ProcessMessage(state, msg);
            }
        }

        return false;
    }

    ProcessMessage(state, msg) {
        let changedData = {
            error: null
        };

        let mesData = null;

        try {
            const res = state[msg.GetName()](this.context, msg);

            if (res) {
                if (res.pop) {
                    this.Delete(this.GetCurrentStep());
                }

                if (res.newStep && !this.IsStepInStack(res.newStep.GetGuid())) {
                    this.Add(res.newStep);
                }

                if (res.changedData) {
                    changedData = { ...changedData, ...res.changedData };
                }

                if (res.message) {
                    mesData = this.SendMessage(res.message);
                }
                
                if (mesData) {
                    changedData = { ...changedData, ...mesData };
                }
            }
        } catch (e) {
            if (msg.GetName() === 'TBLInitMessage') {
                this.Delete(this.GetCurrentStep());
                throw e;
            }

            global.logger.log(`BLAlg error catch: ${e.message}`);

            changedData = {
                ...changedData,
                error: e
            };
        }

        return changedData;
    }

    IsStepInStack(guid) {
        const { stack } = this;
        let state;

        if (stack.length > 0) {
            for (let i = 0; i < stack.length; i++) {
                state = stack[i];
    
                if (state.GetName() === guid) return true;
            }
        }
        
        return false;
    }

    IsStepAtTheTop(guid) {
        const { stack } = this;

        if (stack.length > 0) {
            const state = stack[stack.length - 1];

            if (state.GetName() === guid) return true;
        }

        return false;
    }

    GetFirstStepInStack() {
        const { stack } = this;

        if (stack.length > 0) {
            return stack[0];
        }

        return null;
    }

    GetCurrentGUID() {
        const { stack } = this;
        const stackLength = stack.length;

        if (stackLength > 0) return stack[stackLength - 1].GetGuid();

        return null;
    }

    GetCurrentStep() {
        const { stack } = this;

        if (stack.length > 0) {
            return stack[stack.length - 1];
        }
    
        return null;   
    }

    GetCurrentStepClassName() {
        const { stack } = this;
        const stackLength = stack.length;

        if (stackLength > 0) {
            const state = stack[stackLength - 1];
            return state.GetName();
        }

        return null;
    }

    GetStack() {
        return this.stack.map((step) => {
            return step.GetName();
        });
    }
}
