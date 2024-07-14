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
    res.sendStatus(401);
  }
});


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
    const isViewed = [true, true, true];
    let recipes_id_int_array = [];
    if (recipes_id.length > 0) {
      const recipes_id_string_array = recipes_id.map(id => id.toString());
      recipes_id_int_array = recipes_id_string_array.map(str => parseInt(str, 10));
    }
    let results = [];
    results = await recipe_utils.getRecipePreviewsByIDs(recipes_id_int_array);
    res.status(200).send({ recipes: results, viewed: isViewed, status: 200, success: true });
  } catch(error){
    next(error);
}
});

router.post('/lastViewed/:recipeId', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let recipes_id_array = [];
    recipes_id_array = await user_utils.getLastViewedRecipes(user_id);
    recipes_id_array.push(req.params.recipeId);
    if(recipes_id_array.length === 4){
      recipes_id_array.shift();
    }
    await user_utils.updateLastViewedRecipe(recipes_id_array, user_id);
    res.status(200).send("Last viewed recipes updated");
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
    const { title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, extendedIngredients, summary, analyzedInstructions } = req.body;
    await user_utils.insertRecipe(username, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, extendedIngredients, summary, analyzedInstructions);
    res.status(201).send("Recipe successfully created");
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns all recipes created by the logged-in user
 */
router.get('/MyRecipes', async (req, res, next) => {
  try {
    const { username } = req.query; // Retrieve username from query string
    const recipes = await user_utils.getAllRecipesByUsername(username);
    res.status(200).send(recipes);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns a specific recipe by its ID
 */
router.get('/MyRecipes/:recipeId', async (req, res, next) => {
  try {
    const recipe_id = req.params.recipeId;
    const recipe = await user_utils.getRecipeById(recipe_id);
    if (recipe) {
      res.status(200).send(recipe);
    } else {
      res.status(404).send("Recipe not found");
    }
  } catch (error) {
    next(error);
  }
});



module.exports = router;
