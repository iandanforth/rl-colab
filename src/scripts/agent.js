class Agent {
    constructor() {
    }

    step() {
    }
}


export class MazeRunner extends Agent {
	constructor(location, mazeData) {
		super();

		this.location = location;

		this.policyData = this.getDefaultPolicy(mazeData);
	}

	getDefaultPolicy(mazeData){
		let policyData = [];

		for (let i = 0; i < mazeData.length; i++) {
			let mazeRow = mazeData[i];
			let policyRow = [];
		    for (let j = 0; j < mazeRow.length; j++) {
		    	let mazeCell = mazeRow[j];
		    	let policyCell = [0.25, 0.25, 0.25, 0.25];
		    	policyRow.push(policyCell); 
		    }
		    policyData.push(policyRow);
		}

		return policyData;
	}
}