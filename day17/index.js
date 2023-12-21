import process from 'process';
import { readInput, sortByNumberDesc } from '../utils/index.js';

const DEFAULT_TOTAL_VOLUME = 150;

// Reading args
const [solutionNumber, total,...args] = process.argv.slice(2);
const volume = total ? parseInt(total) : DEFAULT_TOTAL_VOLUME;

(async function() {
    // Reading data
    const data = await readInput('input.txt');

    // Running solution
    return await solutions[solutionNumber](data, volume);
})();

////////////////////////////////////////////

const solutions = {
    '1': solution1,
    '2': solution2
};

////////////////////////////////////////////

async function solution1(data, volume) {
    const containerValues = data.split('\n').map(n => parseInt(n));
    const combinations = findValidCombinations(containerValues, volume);

    console.log('========================');
    console.log('Solution1: ', combinations.length);
    console.log('========================');
}

async function solution2(data, volume) {
    const containerValues = data.split('\n').map(n => parseInt(n));
    const combinations = findValidCombinations(containerValues, volume);
    const minNbContainers = combinations.map(c => c.length).sort(sortByNumberDesc).pop();

    console.log('========================');
    console.log('Solution2: ', combinations.filter(c => c.length === minNbContainers).length);
    console.log('========================');
}

////////////////////////////////////////////

function findValidCombinations(values, total, level = 0) {
    const validValues = values.filter(v => v <= total);

    const combinations = [];
    for(let i = 0; i < validValues.length; ++i) {
        const value = validValues[i];
        if(value === total) {
            combinations.push([value]);
            continue;
        }

        const subCombinations = findValidCombinations(validValues.slice(i + 1), total - value, level + 1);
        subCombinations.forEach(c => combinations.push([value, ...c]));
    }

    return combinations;
}