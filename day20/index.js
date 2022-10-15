import process from 'process';
import { readInput, getAllDivisors } from '../utils/index.js';

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

/*
    We want the first house number n where the sum of divisors d is at least value

    1) Since n is always a divisor of n, and thus part of the sum, the answer is smaller or equal to n (upper bound)
       Since 1 is always a divisor of n, and thus part of the sum, the answer is larger or equal to 1 (lower bound)

    2) We can use a divide and conquer approach to reduce range quicker
       a) Check house number in the middle of range
       b) If number of presents is larger than value, that becomes the new upper bound and we go back to (a)
       c) Otherwise, since there can still be a lower house number with higher number of presents, we have to check both left and right ranges
          We always check smaller ranges first, and larger ranges last
*/
async function solution1(data) {
    const value = parseInt(data);

    const houseNumber = getFirstValidHouseNumber(value, n => {
        return getAllDivisors(n).reduce((total, d) => total + d * 10, 0);
    });

    console.log('========================');
    console.log('Solution1: ', houseNumber);
    console.log('========================');
}

/*
    Same as the above, but now it's the sum of only the divisors which respect d * 50 >= n

    1, 2, 3, ..., 50 = 1 * 50
    2, 4, 6, ..., 100 = 2 * 50
    3, 6, 9, ..., 150 = 3 * 50
    ...
*/
async function solution2(data) {
    const value = parseInt(data);

    const houseNumber = getFirstValidHouseNumber(value, n => {
        return getAllDivisors(n).reduce((total, d) => d * 50 >= n ? total + d * 11 : total, 0);
    });

    console.log('========================');
    console.log('Solution2: ', houseNumber);
    console.log('========================');
}

////////////////////////////////////////////

function getFirstValidHouseNumber(value, getNbPresentsFunction) {
    let nbPresents;
    let houseNumber = value;
    let ranges = [[1, value]];
    while(ranges.length > 0) {
        const [min, max] = ranges.pop();
        if(min === max) {
            continue; // Empty range...
        }

        const half = Math.floor((max + min) / 2);
        nbPresents = getNbPresentsFunction(half);

        if(nbPresents >= value) {
            // New upper bound discovered
            ranges = [[1, half]];

            if(half < houseNumber) {
                houseNumber = half;
                console.log(houseNumber);
            }
        }
        else {
            // We must still check both ranges...
            ranges.push([half + 1, max], [min, half]);
        }
    }

    return houseNumber;
}