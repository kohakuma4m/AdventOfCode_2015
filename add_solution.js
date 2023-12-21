import process from 'process';
import { existsSync, mkdirSync, copyFileSync, openSync } from 'fs';

// Reading args
const [folder, ...args] = process.argv.slice(2);

if(!folder?.match(/^day[0-9][0-9]$/g)) {
    throw new Error('Missing valid folder name in format "dayXX"');
}

// Adding new solution directory
if(!existsSync(folder)) {
    console.log(`Creating new folder: ${folder}`);
    mkdirSync(folder);
}

// Adding new solution default template
const defaultTemplate = 'templates/default.js';
const solutionFile = `${folder}/index.js`;
if(!existsSync(solutionFile)) {
    console.log(`Creating new default template: ${solutionFile}`);
    copyFileSync(defaultTemplate, solutionFile)
}

// Adding new solution input file
const inputFile = `${folder}/input.txt`;
if(!existsSync(inputFile)) {
    console.log(`Creating new empty input file: ${inputFile}`);
    openSync(inputFile, 'w')
}