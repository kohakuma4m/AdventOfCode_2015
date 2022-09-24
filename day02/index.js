import process from 'process';
import { readInput, totalBoxFaceArea, minBoxFaceArea, minBoxFacePerimeter, calculateBoxVolumne } from '../utils/index.js';

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

    let total = 0;
    lines.forEach(line => {
        const [l, w, h] = line.split('x').map(c => parseInt(c));
        total += getWrappingPaperLength(l, w, h);
    });

    console.log('========================');
    console.log('Solution1: ', total);
    console.log('========================');
}

async function solution2(data) {
    const lines = data.split('\n');

    let total = 0;
    lines.forEach(line => {
        const [l, w, h] = line.split('x').map(c => parseInt(c));
        total += getWrappingRibbonLength(l, w, h);
    });

    console.log('========================');
    console.log('Solution2: ', total);
    console.log('========================');
}

////////////////////////////////////////////

function getWrappingPaperLength(l, w, h) {
    return totalBoxFaceArea(l, w, h) + minBoxFaceArea(l, w, h);
}

function getWrappingRibbonLength(l, w, h) {
    return minBoxFacePerimeter(l, w, h) + calculateBoxVolumne(l, w, h);
}