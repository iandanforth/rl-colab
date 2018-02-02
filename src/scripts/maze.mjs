export class Maze {
    constructor(mazeData, goalCoords, mazeRunner) {
        this._mazeData = mazeData; // Array of arrays defining an NxN grid world
        this._goalCoords = goalCoords;
        this._agent = mazeRunner;
        this._running = true;
        this._stepCount = 0;

    }
    //***********************************************************************//
    // Public API

    // Getters / Setters

    get running() {
        return this._running;
    }

    get agent() {
        return this._agent;
    }

    get state() {
        const state = {
            mazeData: this._mazeData,
            stepCount: this._stepCount,
            goalCoords: this._goalCoords,
            running: this._running
        };
        return state
    }

    // Public Methods

    step(frameCount) {
        if (this._running && (frameCount % 1 == 0)) {

            // Here the world stops if the agent achieves its goal. Not optimal
            if (this._agent.satisfied) {
                // How long did it take for the agent to achieve its goal?
                console.log(this._stepCount);
                console.log(this._agent.memoryTrace);
                this._running = false;
            } else {
                // Step the agent one forward so it can perceive and react to the world
                const action = this._agent.step(this, frameCount);
                this._agent.location = this._getLocationAfterAction(
                    this._agent.location,
                    action
                );
            }
            this._stepCount++;
        }
    }

    getStateAtLocation(location) {
        // For now state will just be goal/not goal
        if ((location[0] == this._goalCoords[0]) && location[1] == this._goalCoords[1]) {
            return 1;
        } else {
            return 0;
        }
    }

    reset() {
        this._running = true;
        this._agent.reset();
        this._stepCount = 0;
    }

    //***********************************************************************//
    // Private Methods

    _getLocationAfterAction(currentLocation, action) {
        const boardDim = this._mazeData.length;
        // Deep copy the location so we don't modify it directly
        let newLocation = JSON.parse(JSON.stringify(currentLocation));
        // World reacts to the agents action
        switch (action) {
            // Move left
            case 0:
                newLocation[0] -= newLocation[0] > 0 ? 1 : 0;
                break;
                // Move right
            case 1:
                newLocation[0] += newLocation[0] < (boardDim - 1) ? 1 : 0;
                break;
                // Move Down
            case 2:
                newLocation[1] -= newLocation[1] > 0 ? 1 : 0;
                break;
                // Move Up
            case 3:
                newLocation[1] += newLocation[1] < (boardDim - 1) ? 1 : 0;
                break;
            default:
                break;
        }

        // Only update agent location into non-wall cells
        const mazeRow = this._mazeData[newLocation[1]];
        const mazeCell = mazeRow[newLocation[0]];
        if (mazeCell === 1) {
            return newLocation;
        }

        return currentLocation;
    }

}