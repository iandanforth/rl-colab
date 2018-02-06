import Maze from './maze2.mjs';

export default class World {
    constructor(store, agent) {
        this._store = store;
        this._agent = agent;

        // Add default state to store
        this._init();

    }
    //***********************************************************************//
    // Public API

    step() {
        const state = this._store.getState();
        let { running, stepCount } = state;

        if (state.running) {
            // Here the world stops if the agent achieves its goal. Not optimal
            if (false) {
                running = false;
            } else {
                console.log(stepCount)
            }
            stepCount++;
            this._store.setState(
                {
                    running: running,
                    stepCount: stepCount
                }
            );
        }
    }

    reset() {
        this._init();
    }

    _init() {
        this._store.setState({
            running: true,
            stepCount: 0
        });
    }

    _render() {
        // Create our components
        this._maze = new Maze(store);
    }
}