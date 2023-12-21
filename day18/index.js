import process from 'process';
import { readInput, Grid } from '../utils/index.js';

const DEFAULT_NB_STEPS = 100;

// Reading args
const [solutionNumber, value, ...args] = process.argv.slice(2);
const nbSteps = value ? parseInt(value) : DEFAULT_NB_STEPS;

(async function() {
    // Reading data
    const data = await readInput('input.txt');

    // Running solution
    return await solutions[solutionNumber](data, nbSteps);
})();

////////////////////////////////////////////

const solutions = {
    '1': solution1,
    '2': solution2
};

////////////////////////////////////////////

async function solution1(data, nbSteps) {
    const lines = data.split('\n');
    const lights = new Grid(lines[0].length, lines.length);
    lights.update(lines);

    for(let i = 0; i < nbSteps; ++i) {
        updateLights(lights);
    }

    lights.print();

    console.log('========================');
    console.log('Solution1: ', lights.count(SYMBOLS.ON));
    console.log('========================');
}

async function solution2(data, nbSteps) {
    const lines = data.split('\n');
    const lights = new Grid(lines[0].length, lines.length);
    lights.update(lines);

    for(let i = 0; i < nbSteps; ++i) {
        adjustCornerLights(lights);
        updateLights(lights);
    }

    adjustCornerLights(lights);
    lights.print();

    console.log('========================');
    console.log('Solution2: ', lights.count(SYMBOLS.ON));
    console.log('========================');
}

////////////////////////////////////////////

const SYMBOLS = {
    ON: '#',
    OFF: '.'
};

function updateLights(lights) {
    const newState = lights.cloneGrid();

    for(let j = 0; j < lights.height; ++j) {
        for(let i = 0; i < lights.width; ++i) {
            const adjacentLights = getAdjacentLights(lights.grid, j, i);
            newState[j][i] = getNewState(lights.grid[j][i], adjacentLights);
        }
    }

    lights.update(newState);
}

function getAdjacentLights(grid, j, i) {
    return [
        grid[j - 1]?.[i - 1],
        grid[j - 1]?.[i + 0],
        grid[j - 1]?.[i + 1],
        grid[j + 0]?.[i - 1],
        grid[j + 0]?.[i + 1],
        grid[j + 1]?.[i - 1],
        grid[j + 1]?.[i + 0],
        grid[j + 1]?.[i + 1]
    ];
}

function getNewState(value, adjacentLights) {
    const nbTurnedOnLights = adjacentLights.filter(l => l === SYMBOLS.ON).length;

    switch(value) {
        case SYMBOLS.ON: {
            return [2, 3].includes(nbTurnedOnLights) ? SYMBOLS.ON : SYMBOLS.OFF;
        }
        case SYMBOLS.OFF:
        default: {
            return nbTurnedOnLights === 3 ? SYMBOLS.ON : SYMBOLS.OFF;
        }
    }
}

function adjustCornerLights(lights) {
    lights.grid[0][0] = SYMBOLS.ON;
    lights.grid[0][lights.width - 1] = SYMBOLS.ON;
    lights.grid[lights.height - 1][0] = SYMBOLS.ON;
    lights.grid[lights.height - 1][lights.width - 1] = SYMBOLS.ON;
}