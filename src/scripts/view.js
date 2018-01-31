export class MazeView {
    constructor(two, maze, config, agentStyles) {

        // Instatiated and bound instance of Two
        this.two = two;

        // Two objects
        this.agentCircle = null;
        this.textGroup = null;

        if (config) {
            this.config = config;
        } else {
            this.config = {
                cellDim: 80,
                boardDim: 8,
                boardX: 40,
                boardY: 40,
                cellColorA: 'black',
                cellColorB: 'white'
            };            
        }

        this.agentStyles = agentStyles;

        // Reference to our maze object
        this.maze = maze;

        // Reference to our agent
        this.agent = maze.getAgent();
    }

    drawMaze(mazeData) {
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
                if (mazeData[i][j] == 0) {
                    rect.fill = cellColorA;
                } else {
                    rect.fill = cellColorB;
                }
            }
        }
    }

    drawReinforcement(goalCoords) {
        const {
            cellDim
        } = this.config;

        const goalX = (goalCoords[0] * cellDim) + cellDim / 2;
        const goalY = (goalCoords[1] * cellDim) + cellDim / 2;
        const goal = this.two.makeText('+1', goalX, goalY);
        goal.size = 22;
    }

    drawAgent(agentLocation) {
        const {
            cellDim,
            boardX,
            boardY
        } = this.config;

        // Agent visualization
        let agentX = boardX + (agentLocation[0] * cellDim);
        let agentY = boardY + (agentLocation[1] * cellDim);

        if (!this.agentCircle) {
            const radius = (cellDim / 2) * this.agentStyles.relSize;
            const circle = this.two.makeCircle(agentX, agentY, radius   );

            // The object returned has many stylable properties:
            circle.fill = this.agentStyles.fill;
            circle.stroke = this.agentStyles.stroke;
            circle.linewidth = this.agentStyles.linewidth;
            this.agentCircle = circle;
        }
        
        this.agentCircle.translation.set(agentX, agentY);
    }

    drawAgentPolicy(agentPolicy) {
        const {
            cellDim,
            boardDim,
            boardX,
            boardY
        } = this.config;

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

                const actionVals = agentPolicy[i][j];
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

    initialize() {
        const mazeState = this.maze.getState();
        this.drawMaze(mazeState.mazeData);
        this.drawReinforcement(mazeState.goalCoords);
        const agentPolicy = this.agent.getCurrentPolicy();
        this.drawAgentPolicy(agentPolicy);
        this.update();
    }

    update(redrawPolicy = false) {
        if (redrawPolicy) {
            const agentPolicy = this.agent.getCurrentPolicy();
            this.drawAgentPolicy(agentPolicy);
        }
        const agentLocation = this.agent.getCurrentLocation();
        this.drawAgent(agentLocation);
    }
}