const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_name='${user_id}'`);
    return recipes_id;
}



async function insertRecipe(username, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, extendedIngredients, summary, analyzedInstructions) {
    const query = `
      INSERT INTO MyRecipes (username, recipe_title, readyInMinutes, recipe_image, aggregateLikes, vegan, vegetarian, glutenFree, summary, analyzedInstructions, extendedIngredients)
      VALUES ('${username}', '${title}', ${readyInMinutes}, '${image}', ${aggregateLikes}, ${vegan}, ${vegetarian}, ${glutenFree}, '${summary}', '${JSON.stringify(analyzedInstructions)}', '${JSON.stringify(extendedIngredients)}')
    `;
    
    await DButils.execQuery(query);
  }

  async function getAllRecipesByUsername(username) {
    // Prepare the SQL query
    const query = `
      SELECT *
      FROM myrecipes
      where username ='${username}'`;
  
    // Execute the query with the provided username
    const recipes = await DButils.execQuery(query);
    return recipes;
}

  async function getRecipeById(recipe_id) {
        // Prepare the SQL query
        const query = `
          SELECT *,
            JSON_UNQUOTE(JSON_EXTRACT(extendedIngredients, '$')) AS extendedIngredients,
            JSON_UNQUOTE(JSON_EXTRACT(analyzedInstructions, '$')) AS analyzedInstructions
          FROM myrecipes
          WHERE recipe_id = ${recipe_id}`;
        
        // Execute the query
        const recipes = await DButils.execQuery(query);
      
        if (recipes.length === 0) {
          throw new Error(`Recipe with ID ${recipe_id} not found`);
        }
      
        // Parse JSON fields
        const recipe = recipes[0];
        recipe.extendedIngredients = JSON.parse(recipe.extendedIngredients);
        recipe.analyzedInstructions = JSON.parse(recipe.analyzedInstructions);
      
        return recipe;
      }


exports.getRecipeById = getRecipeById
exports.getAllRecipesByUsername = getAllRecipesByUsername
exports.insertRecipe = insertRecipe  
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
