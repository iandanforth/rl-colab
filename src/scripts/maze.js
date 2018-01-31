import { Maze } from './world.js';
import { MazeRunner } from './agent.js';
import { MazeView } from './view.js';

// Here we would like to import Two as a module but instead assume it exists in the global scope.

(function() {
  
    // Make an instance of two and place it on the page.
    var elem = document.getElementById('draw-shapes');
    var params = { width: 700, height: 700 };
    var two = new Two(params).appendTo(elem);

    const mazeData = [
        [0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,0],
        [1,1,0,0,1,0,1,0],
        [0,1,1,0,0,1,1,0],
        [0,0,1,1,0,1,0,0],
        [0,1,0,1,0,1,1,0],
        [0,1,1,1,1,0,1,1],
        [0,0,0,0,0,0,0,0]
    ];

    const goalCoords = [7, 6]; // [column, row] indexed at 0
    const initialAgentLocation = [0, 2];

    const mazeRunner = new MazeRunner(mazeData, initialAgentLocation);
    const maze = new Maze(mazeData, goalCoords, mazeRunner);

    const mazeStyles = {
        cellDim: 80,
        boardDim: 8,
        boardX: 40,
        boardY: 40,
        cellColorA: 'black',
        cellColorB: 'white'
    };

    const agentStyles = {
        relSize: 0.75,
        fill: 'rgb(0, 200, 255)',
        stroke: 'orangered',
        linewidth: 2
    };

    const mazeView = new MazeView(two, maze, mazeStyles, agentStyles);
    mazeView.initialize();

    const draw = true   ;

    if (draw) {
        const trialCount = 10;
        two.bind('update', (frameCount) => {
            if (maze.running) {
                maze.step(frameCount);
                mazeView.update();                
            }
        }).play();           
    } else {
        let frameCount = 0;
        while (maze.running) {
            maze.step(frameCount);
            frameCount++;
        }
        mazeView.update(true);
        two.update();        
    }

    // for (var i = 0; i < trialCount; i++) {
    //     if (draw) {
    //         two.bind('update', (frameCount) => {
    //             maze.step(frameCount);
    //         }).play();        
    //     } else {
    //         let frameCount = 0;
    //         while (maze.running) {
    //             maze.step(frameCount);
    //             frameCount++;
    //         }
    //         stepCounts.push(frameCount);
    //         maze.reset();
    //         two.update();
    //     }        
    // }

})();
