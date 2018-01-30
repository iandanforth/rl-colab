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
        this.agentCircle = null;

    }

    drawPolicyData() {
        const {
            cellDim,
            boardDim,
            boardX,
            boardY
        } = this.config;

        const policyData = this.agent.policyData;

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
                        case 0:
                            textX -= offset;
                            break;
                        case 1:
                            textY -= offset;
                            break;
                        case 2:
                            textX += offset;
                            break;
                        case 3:
                            textY += offset;
                            break;
                        default:
                            break;
                    }
                    const text = this.two.makeText('' + actionVals[k], textX, textY, 10);
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

    drawAgent() {
        const {
            cellDim,
            boardX,
            boardY
        } = this.config;

        const agentLocation = this.agent.location;

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
        let memoryTrace = [];
        const mtMaxLen = 5;
        const memDiscount = 0.9;
        
        let running = true;
        let agentLocation = this.agent.location;

        if ((agentLocation[0] == this.rfmCoords[0]) && agentLocation[1] == this.rfmCoords[1]) {
            // Assign credit to memory trace
            for (let i = 0; i < memoryTrace.length; i++) {
                const loc = memoryTrace[0];
                const act = memoryTrace[1];
                //policyData[loc[1]][loc[0]][act] = 1.0;
            }
            console.log(memoryTrace);
            running = false;
        } else if (frameCount % 30 == 0) {
            // Deep clone array
            const origLoc = JSON.parse(JSON.stringify(agentLocation));

            // Sample an action based on policy data
            let sample = null;
            let cellPolicy = this.agent.policyData[agentLocation[0]][agentLocation[1]];
            while (sample === null) {
                for (let s = 0; s < cellPolicy.length; s++) {
                    let prob = cellPolicy[s];
                    if (Math.random() < prob) {
                        sample = s;
                    }
                }
            }

            const action = sample;
            switch (action) {
                case 0:
                    agentLocation[0] -= 1;
                    break;
                case 1:
                    agentLocation[0] += 1;
                    break;
                case 2:
                    agentLocation[1] -= 1;
                    break;
                case 3:
                    agentLocation[1] += 1;
                    break;
                default:
                    break;
            }
            // Don't go into walls
            if (!this.mazeData[agentLocation[1]][agentLocation[0]]) {
                agentLocation = origLoc;
            } else {
                // Store our previous location
                memoryTrace.unshift([origLoc, action]);
                // Limit length of memory trace
                if (memoryTrace.length > mtMaxLen) {
                    memoryTrace.pop();
                }
                this.drawAgent(agentLocation);
            }
        }

        this.agent.location = agentLocation;
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
}