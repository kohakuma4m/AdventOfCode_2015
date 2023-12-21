import process from 'process';
import { readInput, generateAllCombinations } from '../utils/index.js';

const DEFAULT_PLAYER_HEALTH = 100;

// Reading args
const [solutionNumber, healthValue, ...args] = process.argv.slice(2);
const playerHealth = healthValue ? parseInt(healthValue) : DEFAULT_PLAYER_HEALTH;

(async function() {
    // Reading data
    const bossData = await readInput('boss.txt');
    const shopData = await readInput('shop.txt');

    // Running solution
    return await solutions[solutionNumber](playerHealth, bossData, shopData);
})();

////////////////////////////////////////////

const solutions = {
    '1': solution1,
    '2': solution2
};

////////////////////////////////////////////

async function solution1(playerHealth, bossData, shopData) {
    const player = { health: playerHealth };
    const boss = readBossStats(bossData);
    const shop = readShopInventory(shopData);

    const equipments = getAllValidEquipmentCombinations(player, shop);

    const winningSimulations = [];
    equipments.forEach((items, idx) => {
        // Equiping gear
        player.damage = items.reduce((total, i) => total + i.damage, 0);
        player.armor = items.reduce((total, i) => total + i.armor, 0);

        // Simulate boss fight
        const { turn, state, isPlayerVictorious } = simulateBossFight(player, boss);
        if(isPlayerVictorious) {
            winningSimulations.push({
                turn,
                state,
                items,
                totalCost: items.reduce((total, i) => total + i.cost, 0)
            });
        }
    });

    // Cheapest winning equipment
    const { turn, state, items, totalCost } = winningSimulations.sort((a, b) => a.totalCost - b.totalCost)[0];

    console.log('========================');
    console.log(`Winning equipement combinations: ${winningSimulations.length} / ${equipments.length}`);
    console.log('Cheapest winning equipment:', { turn, state, items: items.map(i => ({ type: i.type, name: i.name })), totalCost });
    console.log('========================');
    console.log('Solution1: ', totalCost);
    console.log('========================');
}

async function solution2(playerHealth, bossData, shopData) {
    const player = { health: playerHealth };
    const boss = readBossStats(bossData);
    const shop = readShopInventory(shopData);

    const equipments = getAllValidEquipmentCombinations(player, shop);

    const losingSimulations = [];
    equipments.forEach((items, idx) => {
        // Equiping gear
        player.damage = items.reduce((total, i) => total + i.damage, 0);
        player.armor = items.reduce((total, i) => total + i.armor, 0);

        // Simulate boss fight
        const { turn, state, isPlayerVictorious } = simulateBossFight(player, boss);
        if(!isPlayerVictorious) {
            losingSimulations.push({
                turn,
                state,
                items,
                totalCost: items.reduce((total, i) => total + i.cost, 0)
            });
        }
    });

    // Most expensive losing equipment
    const { turn, state, items, totalCost } = losingSimulations.sort((a, b) => b.totalCost - a.totalCost)[0];

    console.log('========================');
    console.log(`Losing equipement combinations: ${losingSimulations.length} / ${equipments.length}`);
    console.log('Most expensive losing equipment:', { turn, state, items: items.map(i => ({ type: i.type, name: i.name })), totalCost });
    console.log('========================');
    console.log('Solution2: ', totalCost);
    console.log('========================');
}

////////////////////////////////////////////

function readBossStats(data) {
    const [health, damage, armor] = data.split('\n').map(l => l.split(':')[1]);
    return { health: parseInt(health), damage: parseInt(damage), armor: parseInt(armor) };
}

const SHOP_CATEGORY_REGEX = /^(\w+):.*$/
const SHOP_ITEM_REGEX = /^(.+)\s+(\d+)\s+(\d+)\s+(\d+)$/

function readShopInventory(data) {
    const shop = {};

    let type;
    data.split('\n').forEach(line => {
        if(!line.trim()) {
            return;
        }

        const [categoryName] = line.match(SHOP_CATEGORY_REGEX)?.slice(1) || [];
        if(categoryName) {
            type = categoryName.trim().toLowerCase();
            shop[type] = [];
            return;
        }

        const [name, cost, damage, armor] = line.match(SHOP_ITEM_REGEX).slice(1);
        const item = { type, name: name.trim(), cost: parseInt(cost), damage: parseInt(damage), armor: parseInt(armor) };
        shop[type].push(item);
    });

    return shop;
}

function getAllValidEquipmentCombinations(player, shop) {
    const doubleRings = generateAllCombinations(shop.rings, 2);

    const equipments = [];

    // Choosing one weapon
    for(let i = 0; i < shop.weapons.length; ++i) {
        const weapon = shop.weapons[i]

        // Choosing zero or one armor
        for(let j = 0; j <= shop.armors.length; ++j) {
            const armor = shop.armors[j] || null;

            // Choosing zero, one, or two ring
            for(let k = 0; k <= shop.rings.length; ++k) {
                const ring = shop.rings[k] || null;
                equipments.push([weapon, armor, ring].filter(item => item !== null));
            }
            for(let k = 0; k < doubleRings.length; ++k) {
                equipments.push([weapon, armor, ...doubleRings[k]].filter(item => item !== null));
            }
        }
    }

    return equipments;
}

function simulateBossFight(player, boss, logTurns = false) {
    const state = {
        player: { ...player },
        boss: { ...boss }
    };

    let turn = 0;
    while(state.player.health > 0 && state.boss.health > 0) {
        turn++;

        if(turn % 2 !== 0) {
            // Player turn
            const damage = state.player.damage > state.boss.armor ? state.player.damage - state.boss.armor : 1;
            state.boss.health -= damage;
            if(logTurns) {
                console.log(`${turn}: The player deals ${damage} damage; the boss goes down to ${state.boss.health} hit points.`)
            }
        }
        else {
            // Boss turn
            const damage = state.boss.damage > state.player.armor ? state.boss.damage - state.player.armor : 1;
            state.player.health -= damage;
            if(logTurns) {
                console.log(`${turn}: The boss deals ${damage} damage; the player goes down to ${state.player.health} hit points.`)
            }
        }
    }

    const isPlayerVictorious = state.player.health > state.boss.health;
    return { turn, state, isPlayerVictorious };
}