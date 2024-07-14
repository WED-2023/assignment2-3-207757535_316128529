const DButils = require("./DButils");



async function markAsFavorite(user_id, recipe_id){
    let usersFavorites = [];
    usersFavorites = await DButils.execQuery(`SELECT * FROM favoriterecipes`);
    if (usersFavorites.find((x) => x.user_name === user_id && x.recipe_id === recipe_id))
      throw { status: 409, message: "You allready liked this recipe" };
    await DButils.execQuery(`INSERT INTO favoriterecipes VALUES ('${user_id}','${recipe_id}')`);
}

async function getFavoriteRecipes(user_id){
const recipes_id = await DButils.execQuery(`SELECT recipe_id FROM favoriterecipes WHERE user_name='${user_id}'`);
return recipes_id;
}

async function getLastViewedRecipes(user_id){
const recipes_id = await DButils.execQuery(`SELECT last_three_recipes FROM lastviewedrecipes WHERE user_name='${user_id}'`);
let recipes_id_array = [];
if (recipes_id.length > 0) {
  const recipes_id_string = recipes_id[0].last_three_recipes;
  recipes_id_array = recipes_id_string.split(',');
}
return recipes_id_array;
}

async function updateLastViewedRecipe(recipes_id_array, user_id){
if (recipes_id_array.length === 1) {
await DButils.execQuery(`INSERT INTO lastviewedrecipes VALUES ('${user_id}','${recipes_id_array.join(", ")}')`);

}
else{
await DButils.execQuery(`UPDATE lastviewedrecipes SET last_three_recipes='${recipes_id_array.join(", ")}' WHERE user_name='${user_id}'`);
}
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
exports.getLastViewedRecipes = getLastViewedRecipes;
exports.updateLastViewedRecipe = updateLastViewedRecipe;