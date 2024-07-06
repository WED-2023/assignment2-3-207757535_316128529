var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");



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
