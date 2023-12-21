import process from 'process';
import { readInput, generateAllPermutations } from '../utils/index.js';

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
    const personsMap = readInstructions(lines);
    const persons = Object.keys(personsMap);

    const arrangements = generateAllPermutations(persons);
    const happiness = getTotalHappiness(arrangements, personsMap);

    console.log('========================');
    console.log('Solution1: ', Math.max(...happiness));
    console.log('========================');
}

async function solution2(data) {
    const lines = data.split('\n');
    const personsMap = readInstructions(lines);
    const persons = Object.keys(personsMap);

    // Adding myself
    personsMap['myself'] = {};
    persons.forEach(person => {
        personsMap[person]['myself'] = 0;
        personsMap['myself'][person] = 0;
    });
    persons.push('myself');

    const arrangements = generateAllPermutations(persons);
    const happiness = getTotalHappiness(arrangements, personsMap);

    // Calculating max value manually, since there is too many values for Math.max
    let max = 0;
    happiness.forEach(h => {
        if(h > max) {
            max = h;
        }
    });

    console.log('========================');
    console.log('Solution2: ', max);
    console.log('========================');
}

////////////////////////////////////////////

const INSTRUCTIONS_REGEX = /^(\w+) would (lose|gain) (\d+) happiness units by sitting next to (\w+)\.$/;

function readInstructions(lines) {
    const index = {};

    lines.forEach(line => {
        const [personA, operation, value, personB] = line.match(INSTRUCTIONS_REGEX).slice(1);
        if(!index[personA]) {
            index[personA] = {};
        }

        index[personA][personB] = operation === 'gain' ? parseInt(value) : -parseInt(value);
    });

    return index;
}

function getTotalHappiness(arrangements, personsMap) {
    return arrangements.map(arrangement => {
        let total = 0;
        for(let i = 0; i < arrangement.length; ++i) {
            const personA = arrangement[i];
            const personB = arrangement[(i+1) % arrangement.length]; // Because table is circular...
            total += personsMap[personA][personB] + personsMap[personB][personA];
        }
        return total;
    });
}