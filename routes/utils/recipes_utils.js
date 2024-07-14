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
        aggregateLikes: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
    }
}
async function getRecipePreviewsByIDs(recipe_ids) {
    try {
      const recipePreviews = await Promise.all(recipe_ids.map(id => getRecipePreviewByID(id)));
      return recipePreviews;
    } catch (error) {
      console.error(`Error fetching recipe previews:`, error);
      throw error;
    }
  }
  
  async function getRecipePreviewsByIDs(recipe_ids) {
    try {
      const recipePreviews = await Promise.all(recipe_ids.map(id => getRecipePreviewByID(id)));
      return recipePreviews;
    } catch (error) {
      console.error(`Error fetching recipe previews:`, error);
      throw error;
    }
  }
  
async function getRecipeFullDetailsByID(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, extendedIngredients, summary, analyzedInstructions  } = recipe_info.data;
    extendedIngredients = extendedIngredients.map(ingredient => ({
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit
      }));
    let steps = analyzedInstructions[0].steps.map(step => ({
    step: step.step
  }));

 
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
        analyzedInstructions: steps,
        summary: summary,
    }}

    async function getRandomRecipePreview(number) {
        try {
            let recipes_info = await getRandomRecipes(number);
            let recipes = recipes_info.data.recipes;
    
            // Map each recipe to extract relevant information
            let recipePreviews = recipes.map(recipe => ({
                id: recipe.id,
                title: recipe.title,
                readyInMinutes: recipe.readyInMinutes,
                image: recipe.image,
                aggregateLikes: recipe.aggregateLikes,
                vegan: recipe.vegan,
                vegetarian: recipe.vegetarian,
                glutenFree: recipe.glutenFree,
            }));
    
            return recipePreviews;
        } catch (error) {
            console.error(`Error fetching random recipe previews:`, error);
            throw error;
        }
    }


    async function searchRecipePreview(query, cuisine, diet, intolerances, sort, number) {
        let recipes_info = await complexSearch(query, cuisine, diet, intolerances, sort, number);
        let recipeIds = recipes_info.data.results.map(recipe => recipe.id);
    
        let recipePreviews = await Promise.all(recipeIds.map(id => getRecipePreviewByID(id)));
    
        return recipePreviews;
    }
exports.getRecipePreviewsByIDs = getRecipePreviewsByIDs
exports.searchRecipePreview = searchRecipePreview
exports.getRandomRecipePreview = getRandomRecipePreview;
exports.getRecipeFullDetailsByID = getRecipeFullDetailsByID;
exports.getRecipePreviewByID = getRecipePreviewByID;



