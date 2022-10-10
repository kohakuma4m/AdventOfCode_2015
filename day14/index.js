import process from 'process';
import { readInput, sortByNumberAsc } from '../utils/index.js';

const DEFAULT_RACE_DURATION = 2503;

// Reading args
const [solutionNumber, duration, ...args] = process.argv.slice(2);
const raceDuration = duration ? parseInt(duration) : DEFAULT_RACE_DURATION;

(async function() {
    // Reading data
    const data = await readInput('input.txt');

    // Running solution
    return await solutions[solutionNumber](data, raceDuration);
})();

////////////////////////////////////////////

const solutions = {
    '1': solution1,
    '2': solution2
};

////////////////////////////////////////////

async function solution1(data, raceDuration) {
    const lines = data.split('\n');
    const reindersData = readReindersData(lines);
    const reinderNames = Object.keys(reindersData);

    const raceResults = runRace(reinderNames, reindersData, raceDuration).sort((r1, r2) => r2.distance - r1.distance);

    console.log('========================');
    printRaceResults(reinderNames, raceResults);
    console.log('========================');
    console.log('Solution1: ', raceResults[0].distance);
    console.log('========================');
}

async function solution2(data, raceDuration) {
    const lines = data.split('\n');
    const reindersData = readReindersData(lines);
    const reinderNames = Object.keys(reindersData);

    const raceResults = runRaceWithPoints(reinderNames, reindersData, raceDuration).sort((r1, r2) => r2.points - r1.points);

    console.log('========================');
    printRaceResults(reinderNames, raceResults, 'points');
    console.log('========================');
    console.log('Solution2: ', raceResults[0].points);
    console.log('========================');
}

////////////////////////////////////////////

const REINDERS_DATA_REGEX = /^(\w+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds\.$/;

function readReindersData(lines) {
    const index = {};

    lines.forEach(line => {
        const [name, speed, speedDuration, restDuration] = line.match(REINDERS_DATA_REGEX).slice(1);
        index[name] = {
            speed: parseInt(speed),
            speedDuration: parseInt(speedDuration),
            restDuration: parseInt(restDuration)
        };
    });

    return index;
}

function runRace(reinderNames, reindersData, duration) {
    const raceState = {};
    reinderNames.forEach(name => {
        raceState[name] = {
            distance: 0,
            timeout: reindersData[name].speedDuration
        };
    });

    let time = -1;
    while(++time < duration) {
        // Updating state...
        updateRaceState(raceState, reinderNames, reindersData);
    }

    const raceResults = reinderNames.map(name => ({ name, ...raceState[name] }));

    return raceResults;
}

function updateRaceState(raceState, reinderNames, reindersData) {
    reinderNames.forEach(name => {
        if(raceState[name].timeout > 0) {
            // Racing...
            raceState[name].timeout--;
            raceState[name].distance += reindersData[name].speed;

            // Updating timer
            if(raceState[name].timeout === 0) {
                raceState[name].timeout = - reindersData[name].restDuration; // --> resting next
            }
        }
        else if(raceState[name].timeout < 0) {
            // Resting...
            raceState[name].timeout++;

            // Updating timer
            if(raceState[name].timeout === 0) {
                raceState[name].timeout = reindersData[name].speedDuration; // --> racing next
            }
        }
    });
}

function printRaceResults(reinderNames, raceResults, property = 'distance') {
    const maxNameLength = reinderNames.map(n => n.length).sort(sortByNumberAsc).pop();

    raceResults.forEach((result, idx) => {
        console.log(`#${(idx + 1).toString().padEnd(2)} ${result.name.padEnd(maxNameLength)} : ${result[property]}`);
    });
}

function runRaceWithPoints(reinderNames, reindersData, duration) {
    const raceState = {};
    reinderNames.forEach(name => {
        raceState[name] = {
            points: 0,
            distance: 0,
            timeout: reindersData[name].speedDuration
        };
    });

    let time = -1;
    while(++time < duration) {
        // Updating state...
        updateRaceState(raceState, reinderNames, reindersData);

        // Updating points...
        const maxDistance = reinderNames.map(name => raceState[name].distance).sort(sortByNumberAsc).pop();
        reinderNames.forEach(name => {
            if(raceState[name].distance === maxDistance) {
                raceState[name].points++;
            }
        });
    }

    const raceResults = reinderNames.map(name => ({ name, ...raceState[name] }));

    return raceResults;
}