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
    const results = await DButils.execQuery(query);
    return results;
  }

  async function getRecipeById(recipe_id) {
    // Prepare the SQL query
    const query = `
      SELECT *
      FROM myrecipes
      WHERE recipe_id = '${recipe_id}'
    `;
  
    // Execute the query with the provided recipe_id
    const results = await DButils.execQuery(query);
    return results.length > 0 ? results[0] : null; // Return the recipe if found, otherwise return null
  }


exports.getRecipeById = getRecipeById
exports.getAllRecipesByUsername = getAllRecipesByUsername
exports.insertRecipe = insertRecipe  
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
