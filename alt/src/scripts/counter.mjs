export default class Counter {
    /**
    * This is a simple state incrementer
    */
    constructor(store, frequency) {
        this._store = store;
        this._intervalHandle = null;
        this._frequency = frequency;

        this._initState();

        // Bind callbacks
        this._increment = this._increment.bind(this);
    }

    /**
    * Public API
    */

    // Public Methods

    // Starts the counter
    start() {
        this._intervalHandle = setInterval(this._increment, this._frequency);
    }

    // Stops the counter
    stop() {
        if (this._intervalHandle !== null) {
            clearTimeout(this._intervalHandle);
            this._intervalHandle = null;
        }
    }

    /**
    * Private Methods
    */

    _increment() {
        let state = this._store.getState();
        state.counter++;
        this._store.setState(state);
    }

    _initState() {
        this._store.setState({counter: 0});
    }
}