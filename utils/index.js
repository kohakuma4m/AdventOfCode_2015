////////////////////////////////////////////
/* File functions */

import { readFile } from 'fs/promises';

export const readInput = async function (filename) {
    return await readFile(filename, { encoding: 'utf8' });
};

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
    Heap's algorithm recursive implementation with O(n!) time complexity
    See https://en.wikipedia.org/wiki/Heap%27s_algorithm

    Note: original array will be modified, but first found permutation will be equal to original array
*/
export const generateAllPermutations = (items, permutations = [], k = items.length) => {
    if(k === 1) {
        // New permutation found
        permutations.push(items.slice());
        return permutations;
    }

    // Generate all sub permutations for original array
    generateAllPermutations(items, permutations, k - 1);

    // Generate all sub permutations for k-th item swapped with each of the k-1 original items
    for(let i = 0; i < k - 1; i++) {
        const j = k % 2 === 0 ? i : 0; // Swapped item index depends on parity of k (even or odd)
        [items[j], items[k - 1]] = [items[k - 1], items[j]]; // Swapping items simultanously

        // Generate all permutations for modified array
        generateAllPermutations(items, permutations, k - 1);
    }

    return permutations;
};

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