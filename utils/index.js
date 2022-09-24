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

export class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y
        this.key = `${this.x}-${this.y}`;
    }
}

////////////////////////////////////////////
/* Other functions */

import { createHash } from 'crypto';

export const getMD5Hash = (string, encoding = 'hex') => createHash('md5').update(string).digest(encoding);