import { Maze } from './world.mjs';
import { MazeRunner } from './agent.mjs';
import { MazeView } from './view.mjs';

(function() {
  
    const container = document.getElementById('draw-shapes');

    const maze1 = [
        [0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,0],
        [1,1,0,0,1,0,1,0],
        [0,1,1,0,0,1,1,0],
        [0,0,1,1,0,1,0,0],
        [0,1,0,1,0,1,1,0],
        [0,1,1,1,1,0,1,1],
        [0,0,0,0,0,0,0,0]
    ];

    const maze2 = [
        [0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,0],
        [1,1,0,0,0,0,1,0],
        [0,1,0,1,1,1,1,0],
        [0,0,0,1,0,0,0,0],
        [0,1,0,1,1,1,1,0],
        [0,1,1,1,1,0,1,1],
        [0,0,0,0,0,0,0,0]
    ];


    const goalCoords = [7, 6]; // [column, row] indexed at 0
    const initialAgentLocation = [0, 2];

    const activeMaze = maze1;
    const mazeRunner = new MazeRunner(activeMaze, initialAgentLocation);
    const maze = new Maze(activeMaze, goalCoords, mazeRunner);

    const mazeStyles = {
        cellDim: 80,
        boardDim: 8,
        boardX: 40,
        boardY: 40,
        cellColorA: '#666666',
        cellColorB: '#F8F8F9',
        cellStroke: '#666666',
        fontFamily: 'HoeflerText-Regular, Cochin, Georgia, serif',
        fontSize: 13
    };

    const agentStyles = {
        relSize: 0.75,
        fill: '#8196E6',
        stroke: '#FEB22E',
        linewidth: 2
    };

    const mazeView = new MazeView(container, maze, mazeStyles, agentStyles);
    mazeView.initialize();

    const draw = false;
    mazeView.play(draw);


    // Controls
    const controls = document.getElementById('controls-container');
    const button = document.createElement("div");
    button.className = "button";
    const buttonText = document.createTextNode("Replay");
    button.appendChild(buttonText);
    button.addEventListener('click', (e) => {
        maze.reset();
        mazeView.play(draw);
    });
    controls.appendChild(button);



})();
