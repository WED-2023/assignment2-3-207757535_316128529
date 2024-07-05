const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
require('dotenv').config();


/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey,
           
        }
    });}

async function getRandomRecipes(number) {
    return await axios.get(`${api_domain}/random`, {
        params: {
            includeNutrition: false,
            instructionsRequired: true,
            apiKey: process.env.spooncular_apiKey,
            number: number
        }
    });}

async function complexSearch(query, cuisine, diet, intolerances, sort, number ) {
    return await axios.get(`${api_domain}/complexSearch`, {
        params: {
            query: query,
            cuisine: cuisine,
            diet: diet,
            intolerances: intolerances,
            sort: sort,
            includeNutrition: false,
            instructionsRequired: true,
            apiKey: process.env.spooncular_apiKey,
            number: number
        }
    });}

async function getRecipePreviewByID(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
    }
}

async function getRecipeFullDetailsByID(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, extendedIngredients, summary, analyzedInstructions  } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        extendedIngredients: extendedIngredients,
        analyzedInstructions: analyzedInstructions,
        summary: summary,
    }}

    async function getRandomRecipePreview(number) {
        let recipes_info = await getRandomRecipes(number);
        let recipes = recipes_info.data.recipes;
    
        return recipes.map(recipe => {
            let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe;
            return {
                id: id,
                title: title,
                readyInMinutes: readyInMinutes,
                image: image,
                popularity: aggregateLikes,
                vegan: vegan,
                vegetarian: vegetarian,
                glutenFree: glutenFree,
            };
        });}


    async function searchRecipePreview(query, cuisine, diet, intolerances, sort, number) {
        let recipes_info = await complexSearch(query, cuisine, diet, intolerances, sort, number);
        let recipeIds = recipes_info.data.results.map(recipe => recipe.id);
    
        let recipePreviews = await Promise.all(recipeIds.map(id => getRecipePreviewByID(id)));
    
        return recipePreviews;
    }

exports.searchRecipePreview = searchRecipePreview
exports.getRandomRecipePreview = getRandomRecipePreview;
exports.getRecipeFullDetailsByID = getRecipeFullDetailsByID;
exports.getRecipePreviewByID = getRecipePreviewByID;



