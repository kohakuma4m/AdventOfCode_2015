import process from 'process';
import { readInput, Position, Grid } from '../utils/index.js';

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
    const lines = data.split('\n');
    const instructions = readInstructions(lines);

    const lights = new Grid(1000, 1000, 0);
    instructions.forEach(([instruction, startPosition, endPosition]) => {
        switchLights(lights, instruction, startPosition, endPosition);
    });

    console.log('========================');
    console.log('Solution1: ', getTotalBrightness(lights));
    console.log('========================');
}

async function solution2(data) {
    const lines = data.split('\n');
    const instructions = readInstructions(lines);

    const lights = new Grid(1000, 1000, 0);
    instructions.forEach(([instruction, startPosition, endPosition]) => {
        adjustBrightness(lights, instruction, startPosition, endPosition);
    });

    console.log('========================');
    console.log('Solution2: ', getTotalBrightness(lights));
    console.log('========================');
}

////////////////////////////////////////////

const INSTRUCTION_REGEX = /^(turn on|turn off|toggle) (\d+),(\d+) through (\d+),(\d+)$/

function readInstructions(lines) {
    return lines.map(line => {
        const [instruction, x1, y1, x2, y2] = line.match(INSTRUCTION_REGEX).slice(1);
        return [instruction, new Position(parseInt(x1), parseInt(y1)), new Position(parseInt(x2), parseInt(y2))];
    })
}

function switchLights(lights, instruction, startPosition, endPosition) {
    for(let j = startPosition.y; j <= endPosition.y; ++j) {
        for(let i = startPosition.x; i <= endPosition.x; ++i) {
            lights.grid[j][i] = getNewState(lights.grid[j][i], instruction);
        }
    }
}

function getNewState(value, instruction) {
    switch(instruction) {
        case 'toggle': {
            return value === 0 ? 1 : 0;
        }
        case 'turn on': {
            return 1;
        }
        case 'turn off': {
            return 0;
        }
    }
}

function adjustBrightness(lights, instruction, startPosition, endPosition) {
    for(let j = startPosition.y; j <= endPosition.y; ++j) {
        for(let i = startPosition.x; i <= endPosition.x; ++i) {
            lights.grid[j][i] = getNewBrightness(lights.grid[j][i], instruction);
        }
    }
}

function getNewBrightness(value, instruction) {
    switch(instruction) {
        case 'toggle': {
            return value + 2;
        }
        case 'turn on': {
            return value + 1;
        }
        case 'turn off': {
            return value > 1 ? value - 1 : 0;
        }
    }
}

function getTotalBrightness(lights) {
    let total = 0;
    lights.grid.forEach(row => {
        row.forEach(value => {
            total += value;
        })
    });

    return total;
}