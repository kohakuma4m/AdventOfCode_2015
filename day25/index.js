import process from 'process';
import { readInput, Position } from '../utils/index.js';

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
    '1': solution1
};

////////////////////////////////////////////

async function solution1(data) {
    const { row, col } = readInstructions(data);

    let current = new CodePosition(1, 1, 1, 20151125);
    do {
        const { x, y } = current.getNextPosition();
        current = new CodePosition(x, y, current.n + 1, current.getNextCode());
    } while(current.x !== col || current.y !== row)

    console.log('========================');
    console.log(current.toString());
    console.log('========================');
    console.log('Solution1: ', current.code);
    console.log('========================');
}

////////////////////////////////////////////

const INSTRUCTIONS_REGEX = /^To continue, please consult the code grid in the manual\.  Enter the code at row (\d+), column (\d+)\.$/;

function readInstructions(data) {
    const [row, col] = data.match(INSTRUCTIONS_REGEX).splice(1);

    return { row: parseInt(row), col: parseInt(col) };
}

class CodePosition extends Position {
    constructor(x, y, n, code) {
        super(x, y);
        this.n = n;
        this.code = code;
    }

    getNextPosition() {
        return this.y === 1
            ? { x: 1, y: this.x + 1}
            : { x: this.x + 1, y: this.y - 1 };
    }

    getNextCode() {
        return (this.code * 252533) % 33554393;
    }

    toString() {
        return `${this.n} (${this.key}): ${this.code}`;
    }
}