import Store from './store.mjs';
import World from './world.mjs';

const main = () => {
    /**
    * Set up the initial state of the application
    */

    const initialState = {
        running: true,
        stepCount: 0,
        draw: true,
        dom: document
    };

    const store = new Store(initialState);
    const world = new World(store);


    // Game loop exists to advance the state of the world
    const draw = true;
    if (!draw) {
        while (true) {
            world.step();
        }
    } else {
        const step = () => {
            world.step();
            window.requestAnimationFrame(step)
        }
        step();
    }

};

main();
