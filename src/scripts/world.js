export class World {
    constructor() {}
}


export class Maze extends World {
    constructor(mazeData, goalCoords, mazeRunner) {
        super();

        // Array of arrays defining an NxN grid world
        this.mazeData = mazeData;
        this.goalCoords = goalCoords;        
        this.agent = mazeRunner;
        this.running = true;
        this.stepCount = 0;

        // VIEW to extract
        // Two objects
        this.agentCircle = null;
        this.textGroup = null;

        this.config = {
            cellDim: 80,
            boardDim: 8,
            boardX: 40,
            boardY: 40,
            cellColorA: 'black',
            cellColorB: 'white'
        };

    }

    getAgent() {
        return this.agent;
    }

    getState() {
        const state = {
            mazeData: this.mazeData,
            stepCount: this.stepCount,
            goalCoords: this.goalCoords,
            running: this.running
        };
        return state
    }

    setState(state) {
        const { mazeData, stepCount, goalCoords, running } = state;

    }

    step(frameCount) {

        const boardDim = this.mazeData.length;
        const mtMaxLen = 5;
        const memDiscount = 0.9;
        
        if (this.running && (frameCount % 1 == 0)) {

            // Here the world stops if the agent achieves its goal. Not optimal
            if (this.agent.satisfied) {
                // How long did it take for the agent to achieve its goal?
                console.log(this.stepCount);
                console.log(this.agent.memoryTrace);
                this.running = false;

            // Update every N frames
            } else {
                // Step the agent one forward so it can perceive and react to the world
                const action = this.agent.step(this, frameCount);

                // Deep copy the location so we don't modify it directly
                let agentLocation = JSON.parse(JSON.stringify(this.agent.location));
                // World reacts to the agents action
                switch (action) {
                    // Move left
                    case 0:
                        agentLocation[0] -= agentLocation[0] > 0 ? 1 : 0;
                        break;
                    // Move right
                    case 1:
                        agentLocation[0] += agentLocation[0] < (boardDim - 1) ? 1 : 0;
                        break;
                    // Move Down
                    case 2:
                        agentLocation[1] -= agentLocation[1] > 0 ? 1 : 0;
                        break;
                    // Move Up
                    case 3:
                        agentLocation[1] += agentLocation[1] < (boardDim - 1) ? 1 : 0;
                        break;
                    default:
                        break;
                }
                // Only update agent location into non-wall cells
                const mazeRow = this.mazeData[agentLocation[1]];
                const mazeCell = mazeRow[agentLocation[0]];
                if (mazeCell === 1) {
                    // Update our agent state
                    this.agent.location = agentLocation;
                }                
            }
            this.stepCount++;
        }
    }

    getStateAtLocation(location) {
        // For now state will just be goal/not goal
        if ((location[0] == this.goalCoords[0]) && location[1] == this.goalCoords[1]) {
            return 1;
        } else {
            return 0;
        }
    }

    // reset() {
    //     this.running = true;
    //     this.agent.reset();
    //     this.stepCount = 0;
    // }
}