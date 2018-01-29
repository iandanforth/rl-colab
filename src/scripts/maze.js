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


  class World {
    constuctor() {

    }
  }

  class Agent {
    constuctor(world) {
      this.world = world;
    }

    step() {

      const percepts = this.world.sense();
    }
  }


  const drawMaze = (mazeData) => {
    const cellDim = 80;
    const boardDim = 8;
    const boardX = 40;
    const boardY = 40;
    const cellColorA = 'black';
    const cellColorB = 'white';

    for (let i = 0; i < boardDim; i++) {
      // Rows
      for (let j = 0; j < boardDim; j++) {
        // Columns
        let cellX = boardX + (cellDim * j);
        let cellY = boardY + (cellDim * i);
        let rect = two.makeRectangle(
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
        
        const actionVals = policyData[i][j];
        
        // Cell text
        for (let k=0; k < 4; k++){
          let textX = cellX;
          let textY = cellY;
          const offset = (cellDim / 3) - 4;
          switch(k){
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
          const text = two.makeText('' + actionVals[k], textX, textY, 10);        
        }
      }
    }

    // Reinforcement
    const rfmCoords = [7, 6];
    const rfmX = (rfmCoords[0] * cellDim) + cellDim / 2;
    const rfmY = (rfmCoords[1] * cellDim) + cellDim / 2;
    const rfm = two.makeText('+1', rfmX, rfmY);
    rfm.size = 22;
    
    // Agent visualization
    let agentLocation = [0, 2];
//     let agentLocation = [5, 5];
    let agentX = boardX + (agentLocation[0] * cellDim);
    let agentY = boardY + (agentLocation[1] * cellDim);
    const circle = two.makeCircle(agentX, agentY, (cellDim / 2) - 10);

    // The object returned has many stylable properties:
    circle.fill = 'rgb(0, 200, 255)';
    circle.stroke = 'orangered'; // Accepts all valid css color
    circle.linewidth = 2;

    let steps = 0;
    let running = true;
    
    let memoryTrace = [];
    const mtMaxLen = 5;
    const memDiscount = 0.9;
    
    two.bind('update', function(frameCount) {
      
      if (running) {
        steps += 1;
        if ((agentLocation[0] == rfmCoords[0]) && agentLocation[1] == rfmCoords[1]) {
          // Assign credit to memory trace
          for (let i = 0; i < memoryTrace.length; i++){
            const loc = memoryTrace[0];
            const act = memoryTrace[1];
            //policyData[loc[1]][loc[0]][act] = 1.0;
          }
          console.log(memoryTrace);
          running = false;
        } else if (frameCount % 1 == 0) {
          // Deep clone array
          const origLoc = JSON.parse(JSON.stringify(agentLocation));
          const action = Math.floor(Math.random() * 4);
          switch(action){
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
          if (!mazeData[agentLocation[1]][agentLocation[0]]) {
            agentLocation = origLoc;        
          } else {
            // Store our previous location
            memoryTrace.unshift([origLoc, action]);
            // Limit length of memory trace
            if (memoryTrace.length > mtMaxLen) {
              memoryTrace.pop();
            }
            agentX = boardX + (agentLocation[0] * cellDim);
            agentY = boardY + (agentLocation[1] * cellDim);
            circle.translation.set(agentX, agentY);      
          }
        }
        
      }
    }).play();  // Finally, start the animation loop
    

  };

  drawMaze(mazeData);
})();

