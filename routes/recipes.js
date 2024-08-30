var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const user_utils = require("./utils/user_utils");


router.get("/", (req, res) => res.send("im here"));


/**
 * This path returns a preview of a recipe by its id
 */
router.get("/preview/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipePreviewByID(req.params.recipeId);
    res.status(200).send({ recipePreview: recipe, status: 200, success: true });
  } catch (error) {
    next(error);
  }
});

router.get("/myRecipePreview/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getMyRecipePreviewsByID(req.params.recipeId);
    res.status(200).send({ recipePreview: recipe, status: 200, success: true });
  } catch (error) {
    next(error);
  }
});


/**
 * This path returns a full details of a recipe by its id
 */
router.get("/fullDetails/:recipeId", async (req, res, next) => {
  try {
    const recipeDetails = await recipes_utils.getRecipeFullDetailsByID(req.params.recipeId);
    res.status(200).send({ recipe: recipeDetails, status: 200, success: true });
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns a full details of a recipe by its id
 */
router.get("/myRecipesFullDetails/:recipeId", async (req, res, next) => {
  try {
    const recipeDetails = await recipes_utils.getMyRecipeFullDetailsByID(req.params.recipeId);
    res.status(200).send({ recipe: recipeDetails, status: 200, success: true });
  } catch (error) {
    next(error);
  }
});

router.get("/random", async (req, res, next) => {
  try {
    const recipes = await recipes_utils.getRandomRecipePreview(req.query.number);
    const isViewed = await user_utils.getViewedRecipes(req.session.user_id, recipes);
    res.status(200).send({ randomRecipes: recipes, viewed: isViewed, status: 200, success: true });
  } catch (error) {
    next(error);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const { query, cuisine, diet, intolerances, sort, number } = req.query;
    const recipes = await recipes_utils.searchRecipePreview(query, cuisine, diet, intolerances, sort, number);
    res.send(recipes);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
