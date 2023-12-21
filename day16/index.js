import process from 'process';
import { readInput } from '../utils/index.js';

const TARGET_FILENAME = 'target.txt';

// Reading args
const [solutionNumber, targetFile, ...args] = process.argv.slice(2);

(async function() {
    // Reading data
    const data = await readInput('input.txt');
    const target = await readInput(targetFile || TARGET_FILENAME);

    // Running solution
    return await solutions[solutionNumber](data, target);
})();

////////////////////////////////////////////

const solutions = {
    '1': solution1,
    '2': solution2
};

////////////////////////////////////////////

async function solution1(data, target) {
    const lines = data.split('\n');
    const info = readClues(lines).map((clues, idx) => ({ id: idx + 1, clues }));
    const targetInfo = readClues([target.replace(/\n/g, ', ')])[0];
    console.log(targetInfo);

    // Finding first match for target (should be only one ?)
    const properties = Object.keys(targetInfo);
    const matchingTargets = info.filter(i => properties.every(p => i.clues[p] === undefined || i.clues[p] === targetInfo[p]));

    console.log('========================');
    printInfo(matchingTargets);
    console.log('========================');
    console.log('Solution1: ', matchingTargets[0]?.id);
    console.log('========================');
}

async function solution2(data, target) {
    const lines = data.split('\n');
    const info = readClues(lines).map((clues, idx) => ({ id: idx + 1, clues }));
    const targetInfo = readClues([target.replace(/\n/g, ', ')])[0];
    console.log(targetInfo);

    // Finding first match for target (should be only one ?)
    const properties = Object.keys(targetInfo);
    const matchingTargets = info.filter(i => properties.every(p => {
        if(i.clues[p] === undefined) {
            return true;
        }

        switch(p) {
            case 'cats':
            case 'trees': {
                return i.clues[p] > targetInfo[p];
            }
            case 'pomeranians':
            case 'goldfish': {
                return i.clues[p] < targetInfo[p];
            }
            default: {
                return i.clues[p] === targetInfo[p];
            }
        }
    }));

    console.log('========================');
    printInfo(matchingTargets);
    console.log('========================');
    console.log('Solution2: ', matchingTargets[0]?.id);
    console.log('========================');
}

////////////////////////////////////////////

const CLUES_REGEX = /^(?:Sue \d+: )?(.*)$/;

function readClues(lines) {
    return lines.map(line => {
        const [clues] = line.match(CLUES_REGEX).slice(1);

        let index = {};
        clues.split(', ').forEach(c => {
            const [key, value] = c.split(': ');
            index[key] = parseInt(value);
        });

        return index;
    });
}

function printInfo(matches) {
    matches.forEach(m => {
        console.log(`#${m.id.toString().padEnd(3)}-->`, m.clues);
    });
}