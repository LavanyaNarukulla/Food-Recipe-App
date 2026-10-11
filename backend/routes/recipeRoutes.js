const express = require("express");
const Recipe = require("../models/Recipe");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

// 1. Get all recipes (public — no auth required)
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch recipes.",
    });
  }
});

// 2. Add a new recipe (owner taken from the verified token, NOT the request body)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      ingredients,
      instructions,
      cookingTime,
      difficulty,
      category,
      image,
    } = req.body;

    if (
      !name ||
      !Array.isArray(ingredients) ||
      ingredients.length === 0 ||
      !Array.isArray(instructions) ||
      instructions.length === 0 ||
      !cookingTime ||
      !category
    ) {
      return res.status(400).json({
        message: "Please provide all required recipe details.",
      });
    }

    const recipe = new Recipe({
      name,
      ingredients,
      instructions,
      cookingTime,
      difficulty,
      category,
      image,
      owner: req.user._id,
    });

    const savedRecipe = await recipe.save();

    res.status(201).json({
      message: "Recipe added successfully!",
      recipe: savedRecipe,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to add recipe.",
      error: error.message,
    });
  }
});

// 3. Update a recipe (owner only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found.",
      });
    }

    // Enforce ownership using the verified token identity.
    if (!recipe.owner || recipe.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to edit this recipe.",
      });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Recipe updated successfully!",
      recipe: updatedRecipe,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update recipe.",
      error: error.message,
    });
  }
});

// 4. Delete a recipe (owner only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found.",
      });
    }

    // Enforce ownership using the verified token identity.
    if (!recipe.owner || recipe.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to delete this recipe.",
      });
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Recipe deleted successfully!",
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete recipe.",
    });
  }
});

module.exports = router;