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

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getLastViewedRecipes = getLastViewedRecipes;
exports.updateLastViewedRecipe = updateLastViewedRecipe;


