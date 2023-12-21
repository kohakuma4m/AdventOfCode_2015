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
    const jsonData = JSON.parse(data);

    console.log('========================');
    console.log('Solution1: ', getSum(jsonData));
    console.log('========================');
}

async function solution2(data) {
    const jsonData = JSON.parse(data);

    console.log('========================');
    console.log('Solution2: ', getSum(jsonData, true));
    console.log('========================');
}

////////////////////////////////////////////

function getSum(jsonData, ignoreRedValues = false) {
    switch(typeof jsonData) {
        case 'object': {
            if(Array.isArray(jsonData)) {
                return jsonData.reduce((total, d) => total + getSum(d, ignoreRedValues), 0);
            }

            const values = Object.values(jsonData);
            if(ignoreRedValues && values.includes('red')) {
                return 0; // Skipping object with "red" values
            }

            return values.reduce((total, d) => total + getSum(d, ignoreRedValues), 0);
        }
        case 'number': {
            return parseInt(jsonData);
        }
        case 'string':
        default: {
            return 0;
        }
    }
}