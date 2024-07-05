var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));


/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipePreviewByID(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});
// async function testGetRecipeDetails() {
//   try {
//       const recipeDetails = await recipes_utils.getRecipeDetails(716429); // Replace with a valid recipe ID
//       console.log(recipeDetails);
//   } catch (error) {
//       console.error('Error fetching recipe details:', error);
//   }
// }

// testGetRecipeDetails();

module.exports = router;
