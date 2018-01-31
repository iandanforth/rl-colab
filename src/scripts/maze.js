import { Maze } from './world.js';
import { MazeRunner } from './agent.js';

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
  
    const policyData = [
        [[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25]],
        [[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25]],
        [[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25]],
        [[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25]],
        [[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25]],
        [[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25]],
        [[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0,0,0,0]],
        [[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25],[0.25,0.25,0.25,0.25]]
    ];


    const rfmCoords = [7, 6]; // [column, row] indexed at 0
    const agentLocation = [0, 2];
    const mazeRunner = new MazeRunner(agentLocation, mazeData);
    const maze = new Maze(two, mazeData, rfmCoords, mazeRunner);
    maze.draw();
    maze.drawPolicyData();
    maze.drawReinforcement();
    maze.drawAgent();

    const draw = false;

    if (draw) {
        const trialCount = 10;
        two.bind('update', (frameCount) => {
            maze.step(frameCount);
        }).play();           
    } else {
        let frameCount = 0;
        while (maze.running) {
            maze.step(frameCount);
            frameCount++;
        }
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
