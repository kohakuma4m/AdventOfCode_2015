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
    const password = generateNextValidPassword(data);

    console.log('========================');
    console.log('Solution1: ', password);
    console.log('========================');
}

async function solution2(data) {
    let password = generateNextValidPassword(data);
    password = generateNextValidPassword(password);

    console.log('========================');
    console.log('Solution2: ', password);
    console.log('========================');
}

////////////////////////////////////////////

function generateNextValidPassword(password) {
    do {
        password = generateNextPassword(password);
    } while(!isValidPassword(password))

    return password;
}

function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

function generateNextPassword(currentPassword) {
    const letters = [...currentPassword];

    for(let i = currentPassword.length - 1; i >= 0; --i) {
        let letter = letters[i];
        if(letter === 'z') {
            letters[i] = 'a';
            continue;
        }

        if(letter === 'h') {
            letter = 'j'; // Skipping invalid letter i
        }

        if(letter === 'n') {
            letter = 'p'; // Skipping invalid letter o
        }

        if(letter === 'k') {
            letter = 'm'; // Skipping invalid letter l
        }

        letters[i] = nextChar(letter);
        break;
    }

    return letters.join('');
}

const CONSECUTIVE_INCREASING_THREE_CHARACTERS_SEQUENCE_REGEX = /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/g;
const NON_OVERLAPPING_DIFFERENT_TWO_CHARACTERS_SEQUENCE_REGEX = /([a-z])\1.*?([a-z])\2/g;
const INVALID_CHARACTERS_REGEX = /[iol]/g;

function isValidPassword(password) {
    return !!password.match(CONSECUTIVE_INCREASING_THREE_CHARACTERS_SEQUENCE_REGEX)
        && !!password.match(NON_OVERLAPPING_DIFFERENT_TWO_CHARACTERS_SEQUENCE_REGEX)
        && !password.match(INVALID_CHARACTERS_REGEX);
}