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
    const lines = data.split('\n');

    let total = 0;
    lines.forEach(line => {
        if(isNiceString(line)) {
            total++;
        }
    });

    console.log('========================');
    console.log('Solution1: ', total);
    console.log('========================');
}

async function solution2(data) {
    const lines = data.split('\n');

    let total = 0;
    lines.forEach(line => {
        if(isNiceString2(line)) {
            total++;
        }
    });

    console.log('========================');
    console.log('Solution2: ', total);
    console.log('========================');
}

////////////////////////////////////////////

const THREE_VOWELS_REGEX = /[aeiou].*?[aeiou].*?[aeiou]/g;
const CONSECUTIVE_REPEATED_LETTER_REGEX = /([a-z])\1/g;
const INVALID_SEQUENCE_REGEX = /(ab|cd|pq|xy)/g

function isNiceString(string) {
    return !!string.match(THREE_VOWELS_REGEX)
        && !!string.match(CONSECUTIVE_REPEATED_LETTER_REGEX)
        && !string.match(INVALID_SEQUENCE_REGEX);
}

const NON_OVERLAPPING_REPEATED_TWO_LETTERS_SEQUENCE_REGEX = /([a-z]{2}).*?\1/g;
const REPEATED_LETTER_WITH_ONE_LETTER_IN_BETWEN_REGEX = /([a-z])[a-z]\1/g;

function isNiceString2(string) {
    return !!string.match(NON_OVERLAPPING_REPEATED_TWO_LETTERS_SEQUENCE_REGEX)
        && !!string.match(REPEATED_LETTER_WITH_ONE_LETTER_IN_BETWEN_REGEX);ß
}