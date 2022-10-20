import process from 'process';
import { readInput, generateAllCombinations } from '../utils/index.js';

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
    const weights = data.split('\n').map(line => parseInt(line));
    const idealGroupCombination = findIdealGroupCombination(weights, 3);
    console.log('Ideal configuration: ', idealGroupCombination);

    console.log('========================');
    console.log('Solution1: ', idealGroupCombination.qe);
    console.log('========================');
}

async function solution2(data) {
    const weights = data.split('\n').map(line => parseInt(line));
    const idealGroupCombination = findIdealGroupCombination(weights, 4);
    console.log('Ideal configuration: ', idealGroupCombination);

    console.log('========================');
    console.log('Solution2: ', idealGroupCombination.qe);
    console.log('========================');
}

////////////////////////////////////////////

/*
    Since each group must be the same weight, that means each group must have the same fraction of the total weight

    Finding all possible group combinations of all size doesn't scale up... but we only want the first group

    1) We find smallest sized group of weights with sum = totalWeight / nbgroups
    2) We validate all first groups to be sure they still allow other two groups to match sum = totalWeight / nbGroups
        Note: We assume there will be at least one, if not, we would have to search next smallest sized group from (1)
    3) We sort valid smallest size groups by quantum entanglement
    4) We return the ideal combination [group1, group2, group3]

    Hypothesis: There is at least one valid combination of 3 groups
*/
function findIdealGroupCombination(weights, nbGroups) {
    console.log('Weights:', weights);
    const totalWeight = weights.reduce((total, w) => total + w, 0);
    const targetWeight = totalWeight / nbGroups;
    console.log(`Target weight = ${targetWeight} / ${totalWeight}`);

    // 1) Find smallest sized valid first groups
    let validGroups;
    for(let i = 0; i < weights.length; ++i) {
        validGroups = generateAllCombinations(weights, i + 1)
            .filter(g => g.reduce((total, w) => total + w, 0) === targetWeight);

        if(validGroups.length > 0) {
            break;
        }
    }
    console.log('Number of smallest valid first groups found: ', validGroups.length);

    // 2) Filtering to keep only valid groups combination
    console.log('Validating...');
    const minGroupLength = validGroups[0].length;
    validGroups = validGroups.map(g1 => {
        console.log(g1);
        const remainingWeights = weights.filter(w => !g1.includes(w));
        return findFirstValidGroupsCombination([g1], remainingWeights, targetWeight, minGroupLength, nbGroups - 1);
    })
    .filter(groups => groups !== null)
    .map(groups => ({ groups, qe: groups[0].reduce((total, w) => total * w, 1) })); // Mapping data

    // 3) Sorting by quantum entanglement
    console.log('Sorting...');
    validGroups.sort((a, b) => a.qe - b.qe);

    return validGroups[0];
}

function findFirstValidGroupsCombination(groupsCombination, remainingWeights, targetWeight, minGroupLength, k) {
    if(k === 1) {
        // Last group to validate
        return remainingWeights.reduce((total, w) => total + w, 0) === targetWeight
            ? groupsCombination.concat([remainingWeights])
            : null;
    }

    for(let i = minGroupLength - 1; i < remainingWeights.length; ++i) {
        const nextValidGroups = generateAllCombinations(remainingWeights, i + 1)
            .filter(g => g.reduce((total, w) => total + w, 0) === targetWeight);

        for(const g of nextValidGroups) {
            const validCombination = findFirstValidGroupsCombination(groupsCombination.concat([g]), remainingWeights.filter(w => !g.includes(w)), targetWeight, minGroupLength, k - 1);
            if(validCombination) {
                return validCombination;
            }
        }
    }

    return null;
}