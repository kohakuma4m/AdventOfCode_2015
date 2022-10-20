import process from 'process';
import { readInput, generateAllPartitions } from '../utils/index.js';

const DEFAULT_NB_CALORIES = 500;

// Reading args
const [solutionNumber, value, ...args] = process.argv.slice(2);
const nbCalories = value ? parseInt(value) : DEFAULT_NB_CALORIES;

(async function() {
    // Reading data
    const data = await readInput('input.txt');

    // Running solution
    return await solutions[solutionNumber](data, nbCalories);
})();

////////////////////////////////////////////

const solutions = {
    '1': solution1,
    '2': solution2
};

////////////////////////////////////////////

async function solution1(data) {
    const lines = data.split('\n');
    const ingredientsData = readIngredientsData(lines);
    const ingredients = Object.keys(ingredientsData);

    const recipes = generateRecipes(ingredients)
        .map(r => ({
            quantities: r.quantities,
            score: calculateRecipeScore(r.quantities, ingredients, ingredientsData)
        }))
        .filter(r => r.score > 0)
        .sort((r1, r2) => r2.score - r1.score);

    console.log('========================');
    printTopRecipes(recipes, 10);
    console.log('========================');
    console.log('Solution1: ', recipes[0].score);
    console.log('========================');
}

async function solution2(data, nbCalories) {
    const lines = data.split('\n');
    const ingredientsData = readIngredientsData(lines);
    const ingredients = Object.keys(ingredientsData);

    const recipes = generateRecipes(ingredients)
        .map(r => ({
            quantities: r.quantities,
            score: calculateRecipeScore(r.quantities, ingredients, ingredientsData),
            calories: calculateRecipePropertyScore(r.quantities, 'calories', ingredients, ingredientsData)
        }))
        .filter(r => r.score > 0)
        .sort((r1, r2) => r2.score - r1.score);

    const matchingRecipes = recipes.filter(r => r.calories === nbCalories);

    console.log('========================');
    printTopRecipes(recipes, 5);
    printTopRecipes(matchingRecipes, 5);
    console.log('========================');
    console.log('Solution2: ', matchingRecipes[0]?.score);
    console.log('========================');
}

////////////////////////////////////////////

const NB_TEASPOONS = 100;
const INGREDIENTS_PROPERTIES = ['capacity', 'durability', 'flavor', 'texture', 'calories'];
const INGREDIENTS_DATA_REGEX = new RegExp(`^(\\w+): ${INGREDIENTS_PROPERTIES.map(name => `(\\w+) (-?\\d+)`).join(', ')}`);

function readIngredientsData(lines) {
    const index = {};

    lines.forEach(line => {
        const [ingredient, ...properties] = line.match(INGREDIENTS_DATA_REGEX).slice(1);
        index[ingredient] = {};
        INGREDIENTS_PROPERTIES.forEach(name => {
            const idx = properties.indexOf(name);
            index[ingredient][name] = parseInt(properties[idx + 1]);
        });
    });

    return index;
}

function generateRecipes(ingredients) {
    //return generateAllPartitionsForArray([...Array(NB_TEASPOONS).keys()], ingredients.length)
    //    .map(c => c.map(subset => subset.length))
    return generateAllPartitions(NB_TEASPOONS, ingredients.length)
        .map(quantities => ({
            quantities: ingredients.reduce((index, ingredient, idx) => {
                index[ingredient] = quantities[idx] || 0;
                return index;
            }, {})
        }));
}

function calculateRecipeScore(quantities, ingredients, ingredientsData) {
    let score = 1;

    for(let i = 0; i < INGREDIENTS_PROPERTIES.length; ++i) {
        const property = INGREDIENTS_PROPERTIES[i];
        if(INGREDIENTS_PROPERTIES[i] === 'calories') {
            continue; // Calories does not affect the score
        }

        const propertyScore = calculateRecipePropertyScore(quantities, property, ingredients, ingredientsData);
        if(propertyScore <= 0) {
            return 0; // No score
        }

        score *= propertyScore;
    }

    return score;
}

function calculateRecipePropertyScore(quantities, property, ingredients, ingredientsData) {
    return ingredients.reduce((total, ingredient) => {
        return total + quantities[ingredient] * ingredientsData[ingredient][property];
    }, 0);
}

function printTopRecipes(recipes, n = recipes.length) {
    if(recipes.length === 0) {
        return;
    }

    const maxScoreLength = recipes[0].score.toString().length;

    recipes.slice(0, n).forEach(r => {
        console.log(`Score: ${r.score.toString().padEnd(maxScoreLength)}, calories: ${r.calories || '---'}, quantities:`, r.quantities);
    });

    if(n < recipes.length) {
        console.log('...');
    }
}