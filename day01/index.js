import process from 'process';
import { readInput } from '../utils/index.js';

// Reading args
const [solutionNumber, ...args] = process.argv.slice(2);

(async function() {
    // Reading data
    const data = await readInput('input.txt');

    // Running solution
    return await solutions[solutionNumber](data);
})();

////////////////////////////////////////////

const solutions = {
    '1': solution1,
    '2': solution2
};

////////////////////////////////////////////

async function solution1(data) {
    let floorNumber = 0;
    for(const c of data) {
        floorNumber = getNextFloornumber(floorNumber, c);
    }

    console.log('========================');
    console.log('Solution1: ', floorNumber);
    console.log('========================');
}

async function solution2(data) {
    let idx = -1;
    let floorNumber = 0;
    while(++idx < data.length) {
        floorNumber = getNextFloornumber(floorNumber, data[idx]);
        if(floorNumber === -1) {
            break;
        }
    }

    console.log('========================');
    console.log('Solution2: ', idx + 1); // Position starts at 1
    console.log('========================');
}

////////////////////////////////////////////

function getNextFloornumber(currentFloor, direction) {
    switch(direction) {
        case '(': {
            return currentFloor + 1;
        }
        case ')': {
            return currentFloor - 1;
        }
        default: {
            throw new Error(`Invalid character: "${direction}"`);
        }
    }
}