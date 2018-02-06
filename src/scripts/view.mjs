import Two from 'https://cdn.rawgit.com/jonobr1/two.js/dev/build/two.module.js';

export class MazeView {
    constructor(store, container, maze, config, agentStyles) {

        this._store = store;

        const params = {
            width: 700,
            height: 700
        };
        this._two = new Two(params).appendTo(container);

        // Two objects
        this._agentCircle = null;
        this._textGroup = null;

        if (config) {
            this._config = config;
        } else {
            this._config = {
                cellDim: 80,
                boardDim: 8,
                boardX: 40,
                boardY: 40,
                cellColorA: 'black',
                cellColorB: 'white'
            };
        }

        this._agentStyles = agentStyles;

        // Reference to our maze object
        this._maze = maze;

        // Reference to our agent
        this._agent = maze.agent;
    }
    //***********************************************************************//
    // Public API

    initialize() {
        const state = this._store.getState();
        const mazeLayout = state.maze.layout;

        this._drawMaze(state.maze.layout);

        this._drawReinforcement(state.maze.goalCoords);

        const agentPolicy = this._agent.policy;
        this._drawAgentPolicy(agentPolicy);
        this.update();
    }

    update(redrawPolicy = false) {
        if (redrawPolicy) {
            const agentPolicy = this._agent.policy;
            this._drawAgentPolicy(agentPolicy);
        }
        const agentLocation = this._agent.location;
        this._drawAgent(agentLocation);
    }

    play(draw = true) {
        let once = false;
        let frameCount = 0;
        if (draw) {
            this._two.bind('update', (frameCount) => {
                const state = this._store.getState();

                if (state.maze.running) {
                    this._maze.step(frameCount);
                    this.update();
                } else if (!once) {
                    this.update(true);
                    once = true;
                }
            }).play();
        } else {
            while (this._maze.running) {
                this._maze.step(frameCount);
                this.update();
                frameCount++;
            }
            this.update(true);
            this._two.update();
        }
    }

    //***********************************************************************//
    // Private Methods

    _drawAgent(agentLocation) {
        const {
            cellDim,
            boardX,
            boardY
        } = this._config;

        // Agent visualization
        let agentX = boardX + (agentLocation[0] * cellDim);
        let agentY = boardY + (agentLocation[1] * cellDim);

        if (!this._agentCircle) {
            const radius = (cellDim / 2) * this._agentStyles.relSize;
            const circle = this._two.makeCircle(agentX, agentY, radius);

            // The object returned has many stylable properties:
            circle.fill = this._agentStyles.fill;
            circle.stroke = this._agentStyles.stroke;
            circle.linewidth = this._agentStyles.linewidth;
            this._agentCircle = circle;
        }

        this._agentCircle.translation.set(agentX, agentY);
    }

    _drawAgentPolicy(agentPolicy) {
        const {
            cellDim,
            boardDim,
            boardX,
            boardY,
            fontFamily,
            fontSize
        } = this._config;

        // Remove old text
        if (this._textGroup) {
            this._textGroup.remove();
        }
        this._textGroup = this._two.makeGroup();

        for (let i = 0; i < boardDim; i++) {
            // Rows
            for (let j = 0; j < boardDim; j++) {
                let cellX = boardX + (cellDim * j);
                let cellY = boardY + (cellDim * i);

                const actionVals = agentPolicy[i][j];
                if (actionVals !== null) {
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
                        const text = this._two.makeText(actionVals[k].toFixed(2), textX, textY);
                        text.size = fontSize;
                        text.family = fontFamily;
                        this._textGroup.add(text);
                    }
                }
            }
        }
    }

    _drawMaze(mazeData) {
        const {
            cellDim,
            boardDim,
            boardX,
            boardY,
            cellColorA,
            cellColorB,
            cellStroke
        } = this._config;

        for (let i = 0; i < boardDim; i++) {
            // Rows
            for (let j = 0; j < boardDim; j++) {
                // Columns
                let cellX = boardX + (cellDim * j);
                let cellY = boardY + (cellDim * i);
                let rect = this._two.makeRectangle(
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

                rect.stroke = cellStroke;
            }
        }
    }

    _drawReinforcement(goalCoords) {
        const {
            cellDim,
            fontFamily,
            fontSize
        } = this._config;

        const goalX = (goalCoords[0] * cellDim) + cellDim / 2;
        const goalY = (goalCoords[1] * cellDim) + cellDim / 2;
        const goalText = this._two.makeText('+1', goalX, goalY);
        goalText.size = 20;
        goalText.family = fontFamily;
    }

}