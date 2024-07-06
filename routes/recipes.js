var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));


/**
 * This path returns a preview of a recipe by its id
 */
router.get("/preview/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipePreviewByID(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns a full details of a recipe by its id
 */
router.get("/fullDetaile/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeFullDetailsByID(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

router.get("/random", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRandomRecipePreview(req.params.number);
    res.send(recipe);
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
