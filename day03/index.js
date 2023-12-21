import process from 'process';
import { readInput, Position } from '../utils/index.js';

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
    let position = new Position(0, 0);
    const visitedPositionsIndex = {
        [position.key]: 1
    };

    for(const c of data) {
        position = getNextHousePosition(position, c);
        visitedPositionsIndex[position.key] = (visitedPositionsIndex[position.key] || 0) + 1;
    }

    console.log('========================');
    console.log('Solution1: ', Object.keys(visitedPositionsIndex).length);
    console.log('========================');
}

async function solution2(data) {
    let positions = [new Position(0, 0), new Position(0, 0)];
    const visitedPositionsIndex = {
        [positions[0].key]: 2
    };

    for(let i = 0; i < data.length; ++i) {
        positions[i % 2] = getNextHousePosition(positions[i % 2], data[i]);
        visitedPositionsIndex[positions[i % 2].key] = (visitedPositionsIndex[positions[i % 2].key] || 0) + 1;
    }

    console.log('========================');
    console.log('Solution2: ', Object.keys(visitedPositionsIndex).length);
    console.log('========================');
}

////////////////////////////////////////////

function getNextHousePosition(currentPosition, direction) {
    switch(direction) {
        case '^': {
            return new Position(currentPosition.x, currentPosition.y - 1);
        }
        case '>': {
            return new Position(currentPosition.x + 1, currentPosition.y);
        }
        case 'v': {
            return new Position(currentPosition.x, currentPosition.y + 1);
        }
        case '<': {
            return new Position(currentPosition.x - 1, currentPosition.y);
        }
        default: {
            throw new Error(`Invalid character: "${direction}"`);
        }
    }
}