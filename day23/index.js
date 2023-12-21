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
    const instructions = readInstructions(data);
    const { index, registers } = runProgram(instructions);

    console.log('========================');
    console.log({ index, registers });
    console.log('========================');
    console.log('Solution1: ', registers.b);
    console.log('========================');
}

async function solution2(data) {
    const instructions = readInstructions(data);
    const { index, registers } = runProgram(instructions, { a: 1, b: 0 });

    console.log('========================');
    console.log({ index, registers });
    console.log('========================');
    console.log('Solution2: ', registers.b);
    console.log('========================');
}

////////////////////////////////////////////

const INSTRUCTIONS = {
    HALF: 'hlf',
    TRIPLE: 'tpl',
    INCREMENT: 'inc',
    JUMP: 'jmp',
    JUMP_IF_EVEN: 'jie',
    JUMP_IF_ONE: 'jio'
};

const INSTRUCTIONS_FUNCTIONS = {
    [INSTRUCTIONS.HALF]: 'test'
};

const INSTRUCTIONS_REGEX = /^(\w+) (.+?)(?:, (.+))?$/;

function readInstructions(data) {
    return data.split('\n').map(line => {
        const [name, value1, value2] = line.match(INSTRUCTIONS_REGEX).slice(1);
        switch(name) {
            case INSTRUCTIONS.HALF:
            case INSTRUCTIONS.TRIPLE:
            case INSTRUCTIONS.INCREMENT: {
                return { name, register: value1 };
            }
            case INSTRUCTIONS.JUMP: {
                return { name, offset: parseInt(value1) };
            }
            case INSTRUCTIONS.JUMP_IF_EVEN:
            case INSTRUCTIONS.JUMP_IF_ONE: {
                return { name, register: value1, offset: parseInt(value2) };
            }
            default: {
                throw new Error('Invalid instruction: ', line);
            }
        }
    });
}

function runProgram(instructions, registers = { a: 0, b: 0 }) {
    let index = 0;
    while(instructions[index]) {
        const instruction = instructions[index];

        switch(instruction.name) {
            case INSTRUCTIONS.HALF: {
                registers[instruction.register] = Math.floor(registers[instruction.register] / 2);
                index++;
                continue;
            }
            case INSTRUCTIONS.TRIPLE: {
                registers[instruction.register] *= 3;
                index++;
                continue;
            }
            case INSTRUCTIONS.INCREMENT: {
                registers[instruction.register] += 1;
                index++;
                continue;
            }
            case INSTRUCTIONS.JUMP: {
                index += instruction.offset;
                continue;
            }
            case INSTRUCTIONS.JUMP_IF_EVEN: {
                index += registers[instruction.register] % 2 === 0 ? instruction.offset : 1;
                continue;
            }
            case INSTRUCTIONS.JUMP_IF_ONE: {
                index += registers[instruction.register] === 1 ? instruction.offset : 1;
                continue;
            }
        }
    }

    return { index, registers };
}