var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_name FROM users").then((users) => {
      if (users.find((x) => x.user_name === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.status(401);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.body.user_name;
    const recipe_id = req.body.recipe_id;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send({ message: "The Recipe successfully saved as favorite", status: 200, success: true } );
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = recipes_id.map(element => element.recipe_id);
    const results = await recipe_utils.getRecipePreviewsByIDs(recipes_id_array);
    res.status(200).send({ recipes: results, status: 200, success: true });
  } catch(error){
    next(error); 
  }
});

router.get('/lastViewed', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getLastThreeViewedRecipes(user_id);
    let recipes_id_int_array = [];
    if (recipes_id.length > 0) {
      const recipes_id_string_array = recipes_id.map(id => id.toString());
      recipes_id_int_array = recipes_id_string_array.map(str => parseInt(str, 10));
    }
    let results = [];
    results = await recipe_utils.getRecipePreviewsByIDs(recipes_id_int_array);
    res.status(200).send({ recipes: results, status: 200, success: true });
  } catch(error){
    next(error);
  }
});
router.get('/isViewed/:recipeId', async (req,res,next) => {
  try{
    const recipe = req.params.recipeId;
    const user_id = req.session.user_id;
    const isViewed = await user_utils.isViewd(user_id, recipe);

    res.status(200).send({viewed: isViewed, status: 200, success: true });
  } catch(error){
    next(error);
  }
});

router.post('/lastViewed', async (req,res,next) => {
  try{
    const user_id = req.body.user_id;
    let recipes_id_array = [];
    recipes_id_array = await user_utils.getLastThreeViewedRecipes(user_id);
    let recipe_id_str = String(req.body.recipe_id);
    if(!recipes_id_array.includes(recipe_id_str)){
      recipes_id_array.push(req.body.recipe_id);
      if(recipes_id_array.length === 4){
        recipes_id_array.shift();
      }
      await user_utils.updateLastViewedRecipe(recipes_id_array, user_id);
      await user_utils.justWatched(req.body.recipe_id, user_id);

    }
    else{
      let last_viewed_recipes = [];
      if (recipes_id_array.length > 1){
        for (recipe of recipes_id_array){
          if(recipe != recipe_id_str){
            last_viewed_recipes.push(recipe);
          }
        }
      last_viewed_recipes.push(req.body.recipe_id);
      await user_utils.updateLastViewedRecipe(last_viewed_recipes, user_id);
    }
  }
      res.status(200).send({ message: "The Recipe successfully saved as favorite", status: 200, success: true } );
  } catch(error){
    next(error);
}
});

/**
 * This path inserts a new recipe created by the logged-in user
 */
router.post('/MyRecipes', async (req, res, next) => {
  try {
    const username = req.session.user_id;
    const { title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, extendedIngredients, summary, analyzedInstructions, serving } = req.body.recipe_details;
    await user_utils.insertRecipe(username, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, extendedIngredients, summary, analyzedInstructions, serving);
    res.status(200).send({ message: "Recipe successfully created", status: 200, success: true } );
  } catch (error) {
    next(error);
  }
});


router.get('/MyRecipes', async (req, res, next) => {
  try{
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getAllRecipesIDsByUsername(user_id);
    let recipes_id_array = recipes_id.map(element => element.recipe_id);
    const results = await recipe_utils.getMyRecipePreviewsByIDs(recipes_id_array);
    res.status(200).send({ recipes: results, status: 200, success: true });
  } catch(error){
    next(error); 
  }
});



module.exports = router;
