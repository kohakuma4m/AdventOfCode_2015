import { readFile } from 'fs/promises';

/* File functions */
export const readInput = async function (filename) {
    return await readFile(filename, { encoding: 'utf8' });
}

/* Other functions */