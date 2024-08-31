const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    let usersFavorites = [];
    usersFavorites = await DButils.execQuery(`SELECT * FROM favoriterecipes`);
    if(usersFavorites.length > 0){
      if (usersFavorites.find((x) => x.user_name === user_id && x.recipe_id === recipe_id))
        throw { status: 409, message: "You allready liked this recipe" };
    }
    await DButils.execQuery(`INSERT INTO favoriterecipes VALUES ('${user_id}','${recipe_id}')`);
}

async function getFavoriteRecipes(user_id){
const recipes_id = await DButils.execQuery(`SELECT recipe_id FROM favoriterecipes WHERE user_name='${user_id}'`);
return recipes_id;
}

async function getLastThreeViewedRecipes(user_id){
  const recipes_id = await DButils.execQuery(`SELECT last_three_recipes FROM lastthreeviewedrecipes WHERE user_name='${user_id}'`);
  let recipes_id_array = [];
  if (recipes_id && recipes_id.length > 0 && recipes_id[0].last_three_recipes) {
    const recipes_id_string = recipes_id[0].last_three_recipes;
    recipes_id_array = recipes_id_string.split(', ');
  }
  return recipes_id_array;
}

async function updateLastViewedRecipe(recipes_id_array, user_id){
if (recipes_id_array.length === 1) {
await DButils.execQuery(`INSERT INTO lastthreeviewedrecipes VALUES ('${user_id}','${recipes_id_array.join(", ")}')`);
}
  else{
  await DButils.execQuery(`UPDATE lastthreeviewedrecipes SET last_three_recipes='${recipes_id_array.join(", ")}' WHERE user_name='${user_id}'`);
}
}

async function justWatched(recipe_id, user_id){
  const viewed = await DButils.execQuery(`SELECT * FROM lastviewedrecipes WHERE user_name='${user_id}' AND recipe_id='${recipe_id}'`);
  if(viewed.length === 1){
    return;
  }
  else{
    await DButils.execQuery(`INSERT INTO lastviewedrecipes VALUES ('${user_id}','${recipe_id}')`);
  }
}

async function getViewedRecipes(user_id, recipes_id){
  let viewed_array = [];
  const recipes_id_array = recipes_id.map(element => element.id);
  let user_viewed = null;
  for (let i = 0; i < recipes_id_array.length; i++){
     user_viewed = await DButils.execQuery(`SELECT * FROM lastviewedrecipes WHERE user_name='${user_id}' AND recipe_id='${recipes_id_array[i]}'`);
     if(user_viewed.length === 1){
      viewed_array[i] = true;
     }
     else{
      viewed_array[i] = false;
     }
  }
  return viewed_array;
  }

  

async function insertRecipe(username, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, extendedIngredients, summary, analyzedInstructions, serving) {
    const query = `
      INSERT INTO MyRecipes (recipe_title, readyInMinutes, recipe_image, aggregateLikes, vegan, vegetarian, glutenFree, summary, analyzedInstructions, extendedIngredients, serving, username)
      VALUES ('${title}', ${readyInMinutes}, '${image}', ${aggregateLikes}, ${vegan}, ${vegetarian}, ${glutenFree}, '${summary}', '${JSON.stringify(analyzedInstructions)}', '${JSON.stringify(extendedIngredients)}', '${serving}', '${username}')
    `;
    
    await DButils.execQuery(query);
  }

//   async function getAllRecipesByUsername(username) {
//     // Prepare the SQL query
//     const query = `
//       SELECT *
//       FROM myrecipes
//       where username ='${username}'`;
  
//     // Execute the query with the provided username
//     const recipes = await DButils.execQuery(query);
//     return recipes;
// }


async function getAllRecipesIDsByUsername(user_id){
  const recipes_id = await DButils.execQuery(`SELECT recipe_id FROM myrecipes WHERE username='${user_id}'`);
  return recipes_id;
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
exports.getAllRecipesIDsByUsername = getAllRecipesIDsByUsername
exports.insertRecipe = insertRecipe  
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getLastThreeViewedRecipes = getLastThreeViewedRecipes;
exports.updateLastViewedRecipe = updateLastViewedRecipe;
exports.getViewedRecipes = getViewedRecipes;
exports.justWatched = justWatched;