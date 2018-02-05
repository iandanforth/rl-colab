export default class Store {
    /**
    * Centralized state store which allows for direct updates to state
    * Does not implement actions from the redux pattern.
    */
    constructor() {
        this._state = {};
        this._listeners = [];
    }

    /**
    * Public API
    */

    getState() {
        return this._state;
    }

    setState(statePartial) {
        const newState = JSON.parse(JSON.stringify(this._state));
        Object.assign(newState, statePartial);
        this._state = newState;
        this._notify();
    }

    // Public Methods

    subscribe(listener) {
        if (typeof listener !== 'function') {
            throw new Error('You must subscribe using a function');
        }

        this._listeners.push(listener);

        const unsubscribe = () => {
            const index = this._listeners.indexOf(listener);
            this._listeners.splice(index, 1);
        }

        return unsubscribe;
    }

    /**
    * Private Methods
    */

    _notify() {
        for (let listener of this._listeners) {
            listener();
        }
    }

}
