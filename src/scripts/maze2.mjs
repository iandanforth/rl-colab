export default class Maze {
    constructor(store) {
        this._store = store;
        this._handleStateChange = this._handleStateChange.bind(this);
        this._init();
    }

    _init() {
        this._store.subscribe(this._handleStateChange);
    }

    _handleStateChange() {

    }

    _drawMaze() {
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