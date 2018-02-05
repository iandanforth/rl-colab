export default class CounterDisplay {
    /**
    * This listens for state changes and updates the dom
    */
    constructor(store, elem) {
        this._store = store;
        this._elem = elem;

        // Bind callbacks
        this._handleStateChange = this._handleStateChange.bind(this);

        // Subscribe to state changes
        this._unsubscribe = this._store.subscribe(this._handleStateChange);
    }

    /**
    * Private Methods
    */

    _handleStateChange() {
        const state = this._store.getState();
        const currentCount = state.counter;

        // Put the value into the DOM
        this._elem.innerHTML = '' + currentCount;
    }

}