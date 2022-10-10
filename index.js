import process from 'process';
import childProcess from 'child_process';
import { promisify } from 'util';
const forkAsync = promisify(childProcess.fork);

// Reading args
const [folder, ...args] = process.argv.slice(2);

// Running day folder solution
runSolution(folder, args);

////////////////////////////////////////////

async function runSolution(solutionFolder, args) {
    const options = {
        cwd: `./${solutionFolder}`
    };

    await forkAsync('.', [...args], options)
        .then(result => console.log('DONE !'))
        .catch(err => console.error(err));
}
