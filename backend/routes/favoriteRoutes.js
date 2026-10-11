const express = require("express");
const User = require("../models/User");
const Recipe = require("../models/Recipe");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

// All favorite routes require a verified JWT. The user is taken from the token.
router.use(authMiddleware);

// GET /api/favorites  -> list saved recipes for the logged-in user
router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user.favorites || []);
  } catch (error) {
    res.status(500).json({ message: "Failed to load favorites." });
  }
});

// POST /api/favorites  -> add a recipe to the logged-in user's favorites
router.post("/", async (req, res) => {
  try {
    const { recipeId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    const alreadySaved = user.favorites.some(
      (id) => id.toString() === recipeId
    );
    if (alreadySaved) {
      return res.status(200).json({
        message: "Recipe already in favorites.",
        favorites: user.favorites,
      });
    }

    user.favorites.push(recipeId);
    await user.save();

    const populated = await User.findById(user._id).populate("favorites");
    res.status(200).json({
      message: "Recipe saved to favorites!",
      favorites: populated.favorites,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to save favorite." });
  }
});

// DELETE /api/favorites/:recipeId  -> remove a recipe from the logged-in user's favorites
router.delete("/:recipeId", async (req, res) => {
  try {
    const { recipeId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.favorites = user.favorites.filter(
      (id) => id.toString() !== recipeId
    );
    await user.save();

    const populated = await User.findById(user._id).populate("favorites");
    res.status(200).json({
      message: "Recipe removed from favorites.",
      favorites: populated.favorites,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove favorite." });
  }
});

module.exports = router;