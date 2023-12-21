import process from 'process';
import { readInput, generateAllPermutations } from '../utils/index.js';

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
    const routesMap = readRoutes(lines);
    const destinations = Object.keys(routesMap);

    const routes = generateAllPossibleRoutes(destinations); // Original version
    const distances = getRouteDistances(routes, routesMap);

    console.log('========================');
    console.log('Solution1: ', Math.min(...distances));
    console.log('========================');
}

async function solution2(data) {
    const lines = data.split('\n');
    const routesMap = readRoutes(lines);
    const destinations = Object.keys(routesMap);

    const routes = generateAllPermutations(destinations); // Improved version
    const distances = getRouteDistances(routes, routesMap);

    console.log('========================');
    console.log('Solution2: ', Math.max(...distances));
    console.log('========================');
}

////////////////////////////////////////////

const ROUTE_REGEX = /^(\w+) to (\w+) = (\d+)$/;

function readRoutes(lines) {
    const index = {};

    lines.forEach(line => {
        const [source, destination, distance] = line.match(ROUTE_REGEX).slice(1);
        if(!index[source]) {
            index[source] = {};
        }
        if(!index[destination]) {
            index[destination] = {};
        }

        index[source][destination] = parseInt(distance);
        index[destination][source] = index[source][destination]; // In case we go the other way around
    });

    return index;
}

function generateAllPossibleRoutes(items) {
    if(items.length === 1) {
        return [items];
    }

    const permutations = [];

    for(let i = 0; i < items.length; ++i) {
        const item = items[i];
        const otherItems = items.filter(o => o !== item);
        const subCombinations = generateAllPossibleRoutes(otherItems);
        subCombinations.forEach(s => permutations.push([item, ...s]));
    }

    return permutations;
}

function getRouteDistances(routes, routesMap) {
    return routes.map(route => {
        let total = 0;
        for(let i = 0; i < route.length - 1; ++i) {
            total += routesMap[route[i]][route[i+1]];
        }
        return total;
    });
}