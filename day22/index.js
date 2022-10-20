import process from 'process';
import { readInput } from '../utils/index.js';

const DEFAULT_PLAYER_HEALTH = 50;
const DEFAULT_PLAYER_MANA = 500;

// Reading args
const [solutionNumber, healthValue, manaValue, ...args] = process.argv.slice(2);
const playerHealth = healthValue ? parseInt(healthValue) : DEFAULT_PLAYER_HEALTH;
const playerMana = manaValue ? parseInt(manaValue) : DEFAULT_PLAYER_MANA;

(async function() {
    // Reading data
    const bossData = await readInput('boss.txt');
    const spellsData = await readInput('spells.txt');

    // Running solution
    return await solutions[solutionNumber](playerHealth, playerMana, bossData, spellsData);
})();

////////////////////////////////////////////

const solutions = {
    '1': solution1,
    '2': solution2
};

////////////////////////////////////////////

async function solution1(playerHealth, playerMana, bossData, spellsData) {
    const player = { health: playerHealth, mana: playerMana, armor: 0 };
    const boss = readBossStats(bossData);
    const spells = readSpellsData(spellsData);

    const fightSimulations = simulateAllBossFights(player, boss, spells);
    const winningSimulations = fightSimulations.filter(s => s.state.boss.health <= 0);

    // Winning simulation with least amount of mana spend
    const { turn, state, actions, manaCost } = winningSimulations.sort((a, b) => a.manaCost - b.manaCost)[0];

    console.log('========================');
    console.log(`Winning simulations: ${winningSimulations.length} / ${fightSimulations.length}`);
    console.log('Least amount of mana spent to win:', {
        turn,
        state: { ...state, activeSpells: state.activeSpells.map(s => `${s.name} (${s.duration})`) },
        actions: actions.map(a => a.name || '---'), manaCost
    });
    console.log('========================');
    console.log('Solution1: ', manaCost);
    console.log('========================');
}

async function solution2(playerHealth, playerMana, bossData, spellsData) {
    const player = { health: playerHealth, mana: playerMana, armor: 0 };
    const boss = readBossStats(bossData);
    const spells = readSpellsData(spellsData);

    const fightSimulations = simulateAllBossFights(player, boss, spells, { hardMode: true });
    const winningSimulations = fightSimulations.filter(s => s.state.boss.health <= 0);

    // Winning simulation with least amount of mana spend
    const { turn, state, actions, manaCost } = winningSimulations.sort((a, b) => a.manaCost - b.manaCost)[0];

    console.log('========================');
    console.log(`Winning simulations: ${winningSimulations.length} / ${fightSimulations.length}`);
    console.log('Least amount of mana spent to win:', {
        turn,
        state: { ...state, activeSpells: state.activeSpells.map(s => `${s.name} (${s.duration})`) },
        actions: actions.map(a => a.name || '---'), manaCost
    });
    console.log('========================');
    console.log('Solution2: ', manaCost);
    console.log('========================');
}

////////////////////////////////////////////

function readBossStats(data) {
    const [health, damage] = data.split('\n').map(l => l.split(':')[1]);
    return { health: parseInt(health), damage: parseInt(damage), armor: 0 };
}

const SPELLS = {
    MAGIC_MISSLE: 'Magic Missile',
    DRAIN: 'Drain',
    SHIELD: 'Shield',
    POISON: 'Poison',
    RECHARGE: 'Recharge'
};

const SPELLS_REGEX = /^(.+) costs (\d+) mana\. (.*)$/;
const SPELLS_DATA_REGEX = {
    [SPELLS.MAGIC_MISSLE]: /^It instantly does (\d+) damage\.$/,
    [SPELLS.DRAIN]: /^It instantly does (\d+) damage and heals you for (\d+) hit points\.$/,
    [SPELLS.SHIELD]: /^It starts an effect that lasts for (\d+) turns\. While it is active, your armor is increased by (\d+)\.$/,
    [SPELLS.POISON]: /^It starts an effect that lasts for (\d+) turns\. At the start of each turn while it is active, it deals the boss (\d+) damage\.$/,
    [SPELLS.RECHARGE]: /^It starts an effect that lasts for (\d+) turns\. At the start of each turn while it is active, it gives you (\d+) new mana\.$/
};

function readSpellsData(data) {
    return data.split('\n').map(line => {
        const [spellName, spellCost, spellData] = line.match(SPELLS_REGEX).slice(1);
        const spell = {
            name: spellName,
            cost: parseInt(spellCost),
            duration: 0,
            damage: 0,
            health: 0,
            armor: 0,
            mana: 0
        };

        const spellStats = spellData.match(SPELLS_DATA_REGEX[spellName]).slice(1);
        switch(spellName) {
            case SPELLS.MAGIC_MISSLE: {
                const [damage] = spellStats;
                spell.damage = parseInt(damage);
                break;
            }
            case SPELLS.DRAIN: {
                const [damage, health] = spellStats;
                spell.damage = parseInt(damage);
                spell.health = parseInt(health);
                break;
            }
            case SPELLS.SHIELD: {
                const [duration, armor] = spellStats;
                spell.duration = parseInt(duration);
                spell.armor = parseInt(armor);
                break;
            }
            case SPELLS.POISON: {
                const [duration, damage] = spellStats;
                spell.duration = parseInt(duration);
                spell.damage = parseInt(damage);
                break;
            }
            case SPELLS.RECHARGE: {
                const [duration, mana] = spellStats;
                spell.duration = parseInt(duration);
                spell.mana = parseInt(mana);
                break;
            }
        }

        return spell;
    });
}

function getAllValidSpellActions(state, spells) {
    return spells.filter(s => {
        const activeSpell = state.activeSpells.find(s2 => s2.name === s.name);
        return s.cost <= state.player.mana && (!activeSpell || activeSpell.duration <= 0);
    });
}

function initSimulation(turn = 0, { player, boss, activeSpells = [] }, actions = []) {
    return {
        turn,
        state: {
            player: { ...player },
            boss: { ...boss },
            activeSpells: activeSpells.filter(s => s.duration > 0).map(s => ({ ...s }))
        },
        actions: actions.slice()
    };
}

function simulateAllBossFights(player, boss, spells, { hardMode = false } = {}) {
    const simulations = [];
    const simulationsToProcess = [initSimulation(0, { player, boss })];

    const processedStates = {};
    while(simulationsToProcess.length > 0) {
        const { turn, state, actions } = simulationsToProcess.pop();

        ///////////////////////////////////////////////
        // Skipping already processed identical state
        const stateKey = JSON.stringify(state);
        if(processedStates[stateKey]) {
            continue;
        }
        processedStates[stateKey] = true;
        ///////////////////////////////////////////////

        if(state.player.health <= 0 || state.boss.health <= 0) {
            // Simulation end on previous turn...
            simulations.push(initSimulation(turn, state, actions));
            continue;
        }

        // New turn
        const nextTurn = turn + 1;
        const isPlayerTurn = nextTurn % 2 !== 0;

        // Hard mode
        if(isPlayerTurn && hardMode) {
            state.player.health -= 1;

            if(state.player.health <= 0) {
                // Boss wins
                simulations.push(initSimulation(nextTurn, state, actions));
                continue;
            }
        }

        // Active spell effects
        state.player.armor = 0;
        state.activeSpells.forEach(spell => {
            state.player.mana += spell.mana;
            state.boss.health -= spell.damage;
            state.player.armor += spell.armor;
            // state.player.health += spell.health;

            spell.duration--;
        });

        if(state.boss.health <= 0) {
            // Player wins
            simulations.push(initSimulation(nextTurn, state, actions));
            continue;
        }

        if(isPlayerTurn) {
            // Player turn
            const nextActions = getAllValidSpellActions(state, spells);
            if(nextActions.length === 0) {
                // Not enough mana left to cast new spell...game over
                simulations.push(initSimulation(nextTurn, state, actions.concat([{}])));
                continue;
            }

            nextActions.forEach(spell => {
                const nextState = initSimulation(nextTurn, state).state;
                nextState.player.mana -= spell.cost;

                if(spell.duration) {
                    nextState.activeSpells.push({ ...spell });
                }
                else {
                    // Instantaneous spells
                    nextState.boss.health -= spell.damage;
                    nextState.player.health += spell.health;
                    // nextState.player.mana += spell.mana;
                }

                // Next turn
                simulationsToProcess.push(initSimulation(nextTurn, nextState, actions.concat([{ ...spell }])));
            });
        }
        else {
            // Boss turn
            const damage = state.boss.damage > state.player.armor ? state.boss.damage - state.player.armor : 1;
            state.player.health -= damage;

            // Next turn
            simulationsToProcess.push(initSimulation(nextTurn , state, actions));
        }
    }

    // Calculating mana cost for spell actions
    simulations.forEach(s => {
        s.manaCost = s.actions.reduce((total, a) => total + (a.cost || 0), 0);
    });

    return simulations;
}