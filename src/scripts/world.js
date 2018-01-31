export class World {
    constructor() {}
}


export class Maze extends World {
    constructor(two, mazeData, rfmCoords, mazeRunner) {
        super();
        // Instatiated and bound instance of Two
        this.two = two;

        // Array of arrays defining an nxn grid world
        this.mazeData = mazeData;
        this.rfmCoords = rfmCoords;

        this.config = {
            cellDim: 80,
            boardDim: 8,
            boardX: 40,
            boardY: 40,
            cellColorA: 'black',
            cellColorB: 'white'
        };

        this.agent = mazeRunner;
        
        // Two objects
        this.agentCircle = null;
        this.textGroup = null;

        this.running = true;
        this.stepCount = 0;

    }

    drawPolicyData() {
        const {
            cellDim,
            boardDim,
            boardX,
            boardY
        } = this.config;

        const policyData = this.agent.policyData;

        // Remove old text
        if (this.textGroup) {
            this.textGroup.remove();
        }
        this.textGroup = this.two.makeGroup();

        for (let i = 0; i < boardDim; i++) {
            // Rows
            for (let j = 0; j < boardDim; j++) {
                let cellX = boardX + (cellDim * j);
                let cellY = boardY + (cellDim * i);

                const actionVals = policyData[i][j];
                for (let k = 0; k < 4; k++) {
                    let textX = cellX;
                    let textY = cellY;
                    const offset = (cellDim / 3) - 4;
                    switch (k) {
                        // Left
                        case 0:
                            textX -= offset;
                            break;
                        // Right
                        case 1:
                            textX += offset;
                            break;
                        // Up
                        case 2:
                            textY -= offset;
                            break;
                        // Down
                        case 3:
                            textY += offset;
                            break;
                        default:
                            break;
                    }
                    const text = this.two.makeText(actionVals[k].toFixed(2), textX, textY, 10);
                    this.textGroup.add(text);
                }
            }
        }
    }

    drawReinforcement() {
        const {
            cellDim
        } = this.config;

        const rfmX = (this.rfmCoords[0] * cellDim) + cellDim / 2;
        const rfmY = (this.rfmCoords[1] * cellDim) + cellDim / 2;
        const rfm = this.two.makeText('+1', rfmX, rfmY);
        rfm.size = 22;
    }

    drawAgent(agentLocation = this.agent.location) {
        const {
            cellDim,
            boardX,
            boardY
        } = this.config;


        // Agent visualization
        let agentX = boardX + (agentLocation[0] * cellDim);
        let agentY = boardY + (agentLocation[1] * cellDim);

        if (!this.agentCircle) {
            const circle = this.two.makeCircle(agentX, agentY, (cellDim / 2) - 10);

            // The object returned has many stylable properties:
            circle.fill = 'rgb(0, 200, 255)';
            circle.stroke = 'orangered'; // Accepts all valid css color
            circle.linewidth = 2;
            this.agentCircle = circle;
        }
        
        this.agentCircle.translation.set(agentX, agentY);
    }

    step(frameCount) {

        const { boardDim } = this.config;
        const mtMaxLen = 5;
        const memDiscount = 0.9;
        
        if (this.running && (frameCount % 1 == 0)) {

            // Here the world stops if the agent achieves its goal. Not optimal
            if (this.agent.satisfied) {
                // How long did it take for the agent to achieve its goal?
                console.log(this.stepCount);
                console.log(this.agent.memoryTrace);
                // Draw final policy
                this.drawPolicyData();
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
                    // Update our draw layer (two)
                    this.drawAgent();
                }                
            }
            this.stepCount++;
        }
    }

    draw() {
        const {
            cellDim,
            boardDim,
            boardX,
            boardY,
            cellColorA,
            cellColorB
        } = this.config;

        for (let i = 0; i < boardDim; i++) {
            // Rows
            for (let j = 0; j < boardDim; j++) {
                // Columns
                let cellX = boardX + (cellDim * j);
                let cellY = boardY + (cellDim * i);
                let rect = this.two.makeRectangle(
                    cellX,
                    cellY,
                    cellDim,
                    cellDim
                );

                // Base pattern
                if (this.mazeData[i][j] == 0) {
                    rect.fill = cellColorA;
                } else {
                    rect.fill = cellColorB;
                }
            }
        }
    }

    getState(location) {
        // For now state will just be goal/not goal
        if ((location[0] == this.rfmCoords[0]) && location[1] == this.rfmCoords[1]) {
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