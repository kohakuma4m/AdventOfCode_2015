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
    let value = data;

    let i = -1;
    while(++i < 40) {
        console.log(i, value.length);
        value = generateNextLookAndSayValue(value);
    }

    console.log('========================');
    console.log('Solution1: ', value.length);
    console.log('========================');
}

async function solution2(data) {
    let value = data;

    let i = -1;
    while(++i < 50) {
        console.log(i, value.length);
        value = generateNextLookAndSayValue(value);
    }

    console.log('========================');
    console.log('Solution2: ', value.length);
    console.log('========================');
}

////////////////////////////////////////////

const LOOK_AND_SAY_REGEXP = /(.)\1*/g

function generateNextLookAndSayValue(value) {
    const numberGroups = value.match(LOOK_AND_SAY_REGEXP);
    return numberGroups.map(g => `${g.length}${g[0]}`).join('');
}