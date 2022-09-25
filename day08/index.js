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

const ESPACED_SEQUENCES_REGEX = /(\\\\|\\"|\\x[0-9a-fA-F]{2})/g

async function solution1(data) {
    const lines = data.split('\n');

    let total = 0;
    lines.forEach(line => {
        total += line.length - (line.replace(ESPACED_SEQUENCES_REGEX, '_').length - 2); // Literal length - memory length (not counting enclosing double quotes)
    });

    console.log('========================');
    console.log('Solution1: ', total);
    console.log('========================');
}

const ENCODED_SEQUENCES_REGEX = /("|\\)/g

async function solution2(data) {
    const lines = data.split('\n');

    let total = 0;
    lines.forEach(line => {
        total += (line.replace(ENCODED_SEQUENCES_REGEX, '__').length + 2) - line.length; // New encoded literal length (couting enclosing double quotes) - original literal length
    });

    console.log('========================');
    console.log('Solution2: ', total);
    console.log('========================');
}

////////////////////////////////////////////