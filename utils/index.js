////////////////////////////////////////////
/* File functions */

import { readFile } from 'fs/promises';

export const readInput = async function (filename) {
    return await readFile(filename, { encoding: 'utf8' });
};

////////////////////////////////////////////
/* Array functions */

export const sortByNumberAsc = (a, b) => a - b;
export const sortByNumberDesc = (a, b) => b - a;

////////////////////////////////////////////
/* Math functions */

export const totalBoxFaceArea = (l, w, h) => {
    return 2 * calculateRectangleArea(l, w) + 2 * calculateRectangleArea(w, h) + 2 * calculateRectangleArea(h, l);
};

export const minBoxFaceArea = (l, w, h) => {
    return Math.min(...[calculateRectangleArea(l, w), calculateRectangleArea(w, h), calculateRectangleArea(h, l)]);
};

export const minBoxFacePerimeter = (l, w, h) => {
    return Math.min(...[calculateRectanglePerimeter(l, w), calculateRectanglePerimeter(w, h), calculateRectanglePerimeter(h, l)]);
};

export const calculateRectangleArea = (a, b) => a * b;
export const calculateRectanglePerimeter = (a, b) => 2 * a + 2 * b;
export const calculateBoxVolumne = (a, b, c) => a * b * c;

/*
    Get all divisors of a number n >= 0, sorted in ascending order
*/
export const getAllDivisors = (n) => {
    const smallDivisors = [];
    const largeDivisors = [];

    for(let i = 1; i <= Math.sqrt(n); ++i) {
        if(n % i === 0) {
            smallDivisors.push(i);

            const otherDivisor = n / i;
            if(otherDivisor !== i) {
                largeDivisors.push(n / i);
            }
        }
    }

    return smallDivisors.concat(largeDivisors.reverse());
}

/*
    Heap's algorithm recursive implementation with O(n!) time complexity
    See https://en.wikipedia.org/wiki/Heap%27s_algorithm

    Note: original array will be modified, but first found permutation will be equal to original array
*/
export const generateAllPermutations = (items, k = items.length, permutations = []) => {
    if(k === 1) {
        // New permutation found
        permutations.push(items.slice());
        return permutations;
    }

    // Generate all sub permutations for original array
    generateAllPermutations(items, k - 1, permutations);

    // Generate all sub permutations for k-th item swapped with each of the k-1 original items
    for(let i = 0; i < k - 1; i++) {
        const j = k % 2 === 0 ? i : 0; // Swapped item index depends on parity of k (even or odd)
        [items[j], items[k - 1]] = [items[k - 1], items[j]]; // Swapping items simultanously

        // Generate all permutations for modified array
        generateAllPermutations(items, k - 1, permutations);
    }

    return permutations;
};

/*
    Algorithm to recursively generate all possible unique subsets of length k from an array of n items (n choose k)

    e.g: With [1, 2, 3, 4] (n = 4) and k = 2

        { 1, 2 }, { 1, 3 }, { 1, 4 }
        { 2, 3 }, { 2, 4 },
        { 3, 4 }

    For a total of 6 possible unique subsets of length k=2 for n=4 items
*/
export const generateAllCombinations = (items, k) => {
    if(k <= 1) {
        return [...items.map(i => ([i]))]; // n subsets of length 1
    }

    const combinations = [];
    for(let i = 0; i <= items.length - k; ++i) {
        const item = items[i];
        const remainingItems = items.slice(i + 1);

        const subCombinations = generateAllCombinations(remainingItems, k - 1);
        subCombinations.forEach(subCombinationItems => combinations.push([item, ...subCombinationItems]));
    }

    return combinations;
};

/*
    Algorithm to recursively generate all possible partitions of k subsets for an array of n items

    e.g: With [1, 2, 3, 4] (n = 4) and k = 2

        {} | { 1, 2, 3, 4 }
        { 1 } | { 2, 3, 4 }
        { 1, 2 } | { 3, 4 }
        { 1, 2, 3 } | { 4 }
        { 1, 2, 3, 4 } | {}

    For a total of 5 possible ways to split an array of n=4 items in k=2 subsets
*/
export const generateAllPartitionsForArray = (items, k, subPartitionsIndex = {}) => {
    if(k <= 1) {
        return [[items]]; // 1 subset of length n
    }

    const partitions = [];
    for(let i = 0; i <= items.length; ++i) {
        const leftSubset = items.slice(0, i);
        const remainingItems = items.slice(i);
        const key = `${remainingItems.join('_')}-${k - 1}`;
        if(!subPartitionsIndex[key]) {
            // Computing each sub partition only once
            subPartitionsIndex[key] = generateAllPartitionsForArray(remainingItems, k - 1, subPartitionsIndex);
        }

        subPartitionsIndex[key].forEach(rightSubsets => {
            // 1 subset of length i + k-1 subsets for sub array of length n-i
            partitions.push([leftSubset, ...rightSubsets]);
        });
    }

    return partitions;
};

/*
    Faster version of the above algorithm if we only care about subsets size

    e.g: With n = 4 and k = 2

        {} | { 1, 2, 3, 4 } --> { 0 } | { 4 }
        { 1 } | { 2, 3, 4 } --> { 1 } | { 3 }
        { 1, 2 } | { 3, 4 } --> { 2 } | { 2 }
        { 1, 2, 3 } | { 4 } --> { 3 } | { 1 }
        { 1, 2, 3, 4 } | {} --> { 4 } | { 0 }

    For a total of 5 possible ways to split n=4 items in k=2 subsets
*/
export const generateAllPartitions = (n, k) => {
    if(k <= 1) {
        return [[n]]; // 1 subset of length n
    }

    const partitions = [];
    for(let i = 0; i <= n; ++i) {
        const leftSubset = i;
        const subPartitions = generateAllPartitions(n - i, k - 1);
        subPartitions.forEach(rightSubsets => {
            // 1 subset of length i + k-1 subsets for n-i items
            partitions.push([leftSubset, ...rightSubsets]);
        });
    }

    return partitions;
};

/*
    Algorithm to generate all unique combinations of n items in k groups

    e.g: With [1, 2, 3] n = 3 and k = 2

        [ [ 1 ], [ 2, 3 ] ] <--> [ [ 2, 3 ], [ 1 ] ]
        [ [ 2 ], [ 1, 3 ] ] <--> [ [ 1, 3 ], [ 2 ] ]
        [ [ 3 ], [ 1, 2 ] ] <--> [ [ 1, 2 ], [ 3 ] ]

    For a total of 3 possible ways to split n=3 items in k=2 groups in any order
*/
export const generateAllGroupCombinations = (items, nbGroups) => {
    // Generating all partitions for items
    const partitions = generateAllPartitions(items.length, nbGroups)
        .filter(subsets => subsets.every(size => size > 0)) // Removing empty subsets
        .map(p => p.sort(sortByNumberAsc)); // To remove duplicate partitions with partition key = JSON.stringify(p)

    const partitionsIndex = {};
    partitions.forEach(p => {
        const key = JSON.stringify(p);
        partitionsIndex[key] = p;
    });
    console.log(Object.values(partitionsIndex))

    const combinationsIndex = {};
    Object.values(partitionsIndex).forEach(groupSizes => {
        // Choosing each group items, one group at a time
        const combinationsToProcess = [{ groups: [], remainingItems: items.slice() }];
        for(let i = 0; i < nbGroups; ++i) {
            const nbGroupItemsToChoose = groupSizes[i];
            const previousGroupCombinations = combinationsToProcess.splice(0, combinationsToProcess.length);
            previousGroupCombinations.forEach(c => {
                const groupCombinations = generateAllCombinations(c.remainingItems, nbGroupItemsToChoose);
                groupCombinations.forEach(groupItems => {
                    combinationsToProcess.push({
                        groups: c.groups.concat([groupItems]),
                        remainingItems: c.remainingItems.filter(i => !groupItems.includes(i))
                    });
                });
            });
        }

        // Keeping only new unique combinations
        combinationsToProcess.forEach(c => {
            const key = JSON.stringify(c.groups);
            combinationsIndex[key] = c.groups;
        });
    });

    return Object.values(combinationsIndex);
}

export class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y
        this.key = `${this.x}-${this.y}`;
    }
}

export class Grid {
    constructor(width, height, initialValue = 0) {
        this.width = width;
        this.height = height;
        this.grid = [...Array(height).keys()].map(() => [...Array(width).keys()].map(n => initialValue));
    }

    update(data) {
        for(let j = 0; j < this.height; ++j) {
            for(let i = 0; i < this.width; ++i) {
                this.grid[j][i] = data[j][i];
            }
        }
    }

    cloneGrid() {
        return this.grid.map(line => line.slice());
    }

    count(value) {
        return this.grid.reduce((total, line) => total + line.filter(v => v === value).length, 0);
    }

    print() {
        console.log('-'.repeat(this.width + 2));
        for(let j = 0; j < this.height; ++j) {
            console.log('|' + this.grid[j].join('') + '|');
        }
        console.log('-'.repeat(this.width + 2));
    }
}

////////////////////////////////////////////
/* Other functions */

import { createHash } from 'crypto';

export const getMD5Hash = (string, encoding = 'hex') => createHash('md5').update(string).digest(encoding);