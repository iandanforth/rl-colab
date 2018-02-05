import assert from 'assert';
import sum from '/src/scripts/test-functions/sum.mjs';

const tests = [];
const errors = [];

async function add1(x) {
  const a = await resolveAfter2Seconds(20);
  const b = await resolveAfter2Seconds(30);
  return x + a + b;
}

function resolveAfter2Seconds(x) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
}


async function test_add1() {
	const val = await add1(10);
	assert.equal(val, 60);
}

tests.push(test_add1);

async function run() {
	for (let test of tests) {
		try {
			await test();
		} catch (e) {
			errors.push(e);
			console.log(e);
		}
	}

	console.log("***********************************");
	if (errors.length) {
		console.log("FAIL");
		console.log("There were ", errors.length, " errors");	
	} else {
		console.log("PASS");
	}
}

run();
