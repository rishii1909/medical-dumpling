import { createDraft, finishDraft, enableMapSet, enablePatches, } from 'immer';
import isEqual from 'lodash/isEqual';
enableMapSet();
enablePatches();
// A Generic Store class to hold stateful values
export class Store {
    constructor(initialState) {
        this.subscribers = new Set();
        this.state = initialState;
    }
    subscribe(collector, onChange, init = false) {
        let current = collector(this.getState());
        let isInvalidated = false;
        const subscriber = (state) => {
            window.state = state;
            if (isInvalidated) {
                return;
            }
            const newCollectedValues = collector(state);
            if (isEqual(newCollectedValues, current)) {
                return;
            }
            current = newCollectedValues;
            onChange(current);
        };
        if (init) {
            subscriber(this.getState());
        }
        this.subscribers.add(subscriber);
        return () => {
            isInvalidated = true;
            this.subscribers.delete(subscriber);
        };
    }
    getState() {
        return this.state;
    }
    setState(setter, opts = {}) {
        const { onPatch } = {
            onPatch: null,
            ...opts,
        };
        const draft = createDraft(this.state);
        setter(draft);
        this.state = finishDraft(draft, onPatch);
        this.notify();
    }
    notify() {
        this.subscribers.forEach((subscriber) => subscriber(this.getState()));
    }
}
//# sourceMappingURL=Store.js.map