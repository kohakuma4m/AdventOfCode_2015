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
    const wiresIndex = readInstructions(lines);
    const wires = Object.keys(wiresIndex);

    // Note: we could only connect wire 'a', but we might as well connect everything ;)
    let nbConnectedWires = Object.values(wiresIndex).filter(v => !isNaN(v)).length;
    while(nbConnectedWires < wires.length) {
        wires.forEach(w => connectWireRecursively(w, wiresIndex));
        nbConnectedWires = Object.values(wiresIndex).filter(v => !isNaN(v)).length;
    }

    console.log('========================');
    console.log('Solution1: ', wiresIndex['a']);
    console.log('========================');
}

async function solution2(data) {
    const lines = data.split('\n');
    let wiresIndex = readInstructions(lines);
    const wires = Object.keys(wiresIndex);

    connectWireRecursively('a', wiresIndex);

    const valueA = wiresIndex['a'];
    wiresIndex = readInstructions(lines);
    wiresIndex['b'] = valueA;

    connectWireRecursively('a', wiresIndex);

    console.log('========================');
    console.log('Solution2: ', wiresIndex['a']);
    console.log('========================');
}

////////////////////////////////////////////

const INSTRUCTION_REGEX = /(NOT|AND|OR|RSHIFT|LSHIFT)/g

function readInstructions(lines){
    const index = {};

    lines.forEach(line => {
        const terms = line.split(' ');

        if(!line.match(INSTRUCTION_REGEX)) {
            index[terms[2]] = terms[0]; // x -> y
            return;
        }

        if(terms.includes('NOT')) {
            index[terms[3]] = ['NOT', terms[1]]; // NOT x -> y
            return;
        }

        index[terms[4]] = [terms[1], terms[0], terms[2]] // x (AND|OR|RSHIFT|LSHIFT) y -> z
    });

    return index;
}

function connectWireRecursively(w, wiresIndex) {
    const [operation, x, y] = Array.isArray(wiresIndex[w]) ? wiresIndex[w] : [null, wiresIndex[w]];
    switch(operation) {
        case 'NOT': {
            const a = isNaN(x) ? connectWireRecursively(x, wiresIndex) : parseInt(x);
            wiresIndex[w] = ~a & 0xFFFF; // Extra bitwise AND with max 16 bit value to keep result as an unsigned 16 bits value between 0 and 65535 inclusively
            break;
        }
        case 'AND': {
            const a = isNaN(x) ? connectWireRecursively(x, wiresIndex) : parseInt(x);
            const b = isNaN(y) ? connectWireRecursively(y, wiresIndex) : parseInt(y);
            wiresIndex[w] = a & b;
            break;
        }
        case 'OR': {
            const a = isNaN(x) ? connectWireRecursively(x, wiresIndex) : parseInt(x);
            const b = isNaN(y) ? connectWireRecursively(y, wiresIndex) : parseInt(y);
            wiresIndex[w] = a | b;
            break;
        }
        case 'RSHIFT': {
            const a = isNaN(x) ? connectWireRecursively(x, wiresIndex) : parseInt(x);
            wiresIndex[w] = a >> parseInt(y);
            break;
        }
        case 'LSHIFT': {
            const a = isNaN(x) ? connectWireRecursively(x, wiresIndex) : parseInt(x);
            wiresIndex[w] = a << parseInt(y);
            break;
        }
        default: {
            // No operation
            const a = isNaN(x) ? connectWireRecursively(x, wiresIndex) : parseInt(x);
            wiresIndex[w] = a;
            break;
        }
    }

    return wiresIndex[w];
}