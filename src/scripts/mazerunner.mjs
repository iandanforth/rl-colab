export class MazeRunner {
    constructor(store, mazeData, location) {
        this._store = store;
        this._origLoc = JSON.parse(JSON.stringify(location));
        this._location = location;
        this.mazeData = mazeData;
        this.maxMemLen = 5;
        // See https://www.desmos.com/calculator/ntvs7pp8f3
        // for a visualization of how learning rate and decay interact
        this.learningRate = 0.5;
        this.memDecay = 0.5;
        this.actionMap = ["Left", "Right", "Up", "Down"];
        this.reset();

    }
    //***********************************************************************//
    // Public API

    // Getters / Setters

    get location() {
        return this._location;
    }

    set location(newLocation) {
        this._location = newLocation;
    }

    get policy() {
        return this.policyData;
    }

    // Public Methods
    reset() {
        this._location = this._origLoc;
        this.memoryTrace = [];
        this.policyData = this._getDefaultPolicy(this.mazeData);
        this.satisfied = false;
    }

    step(world, frameCount) {
        // Where was I?
        // const prevState = memoryTrace[0];
        // What action did I take last?
        // const prevAction = this.prevAction;
        // Where am I now?
        const location = this._location;

        // Did my previous action change my location?

        // If not maybe it was a dumb action, update

        // Am I satisfied with where I am?
        if (!this.satisfied) {
            // Not yet, Am I at my goal?
            const worldState = world.getStateAtLocation(location);
            const [goalAchieved, rewardSignal] = this._interpret(worldState);
            if (goalAchieved === true) {
                // Yay! I'm satisfied
                this.satisfied = true;
                // Reinforce what I did to get here
                this._reinforce(rewardSignal);

            } else {
                // Not at goal, need to act
                const action = this.getAction(location);
                this._updateMemory(location, action);
                // console.log(location, this.actionMap[action]);
                return action;
            }
        }

        // I am already satisfied, do nothing.
        return null;
    }

    getAction(location) {
        let sample = null;
        const rowData = this.policyData[location[1]];
        const cellPolicy = rowData[location[0]];
        while (sample === null) {
            for (let s = 0; s < cellPolicy.length; s++) {
                let prob = cellPolicy[s];
                if (Math.random() < prob) {
                    sample = s;
                }
            }
        }
        return sample;
    }

    //***********************************************************************//
    // Private Methods

    _getDefaultPolicy(mazeData) {
        let policyData = [];

        for (let i = 0; i < mazeData.length; i++) {
            const mazeRow = mazeData[i];
            let policyRow = [];
            for (let j = 0; j < mazeRow.length; j++) {
                let mazeCell = mazeRow[j];
                let policyCell = null;
                if (mazeCell === 1) {
                    policyCell = [0.25, 0.25, 0.25, 0.25];
                }
                policyRow.push(policyCell);
            }
            policyData.push(policyRow);
        }

        return policyData;
    }

    _interpret(worldState) {
        // Translate our perception of the world into saliency values
        // Start with a direct mapping.
        // Later the reward signal could be reduced due to being satiated
        // or because its an intermediate reward
        let goalAchieved = false;
        let rewardSignal = 0;
        if (worldState === 1) {
            goalAchieved = true;
            rewardSignal = 1;
        }
        return [goalAchieved, rewardSignal];

    }

    _norm(array) {
        // In place norm of an array of numbers
        let sum = 0;
        for (let item of array) {
            sum += item
        };

        for (var i = 0; i < array.length; i++) {
            array[i] /= sum;
        }
    }

    _reinforce(signalStrength) {
        // Modify our policy by assigning credit to actions leading up
        // to the reward signal. Those actions should now occur more
        // frequently in subsequent trials.
        const traceLen = this.memoryTrace.length;
        // Go from back to front where the back is the most recent
        for (var i = traceLen - 1; i >= 0; i--) {
            let step = this.memoryTrace[i];
            let [location, action] = step;
            // Grab reference to cell policy array
            let cellPolicy = this.policyData[location[1]][location[0]];
            // By modifying this array we are modifying policyData
            // Increase the frequency of selected action
            let prevValue = cellPolicy[action];
            let exp = (traceLen - 1) - i;
            // Discount by the signal strength
            let valUpdate = this.learningRate * signalStrength;
            // Further discount the increment by how many steps from the goal it was
            valUpdate = parseFloat((valUpdate * Math.pow(this.memDecay, exp)).toFixed(2));
            let newValue = prevValue + valUpdate;
            cellPolicy[action] = newValue;
            this._norm(cellPolicy);
            console.log(cellPolicy);
        }
    }

    _updateMemory(location, action) {
        // Store in memory trace
        this.memoryTrace.push([location, action]);

        if (this.memoryTrace.length > this.maxMemLen) {
            this.memoryTrace.shift();
        }
    }
}