import process from 'process';
import { readInput, getMD5Hash } from '../utils/index.js';

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
    console.log('========================');
    console.log('Solution1: ', getMinHashNumber(data, '00000'));
    console.log('========================');
}

async function solution2(data) {
    console.log('========================');
    console.log('Solution2: ', getMinHashNumber(data, '000000'));
    console.log('========================');
}

////////////////////////////////////////////

function getMinHashNumber(secret, prefix) {
    let n = 0;
    let hash = getMD5Hash(secret)
    while(!hash.startsWith(prefix)) {
        hash = getMD5Hash(`${secret}${++n}`);
    }

    return n;
}