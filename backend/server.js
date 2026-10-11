
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// User API routes
app.use("/api/users", userRoutes);

// Recipe API routes
app.use("/api/recipes", recipeRoutes);

// Favorite API routes
app.use("/api/favorites", favoriteRoutes);

app.get("/", (req, res) => {
  res.send("Food Recipe App Backend is running!");
});

mongoose
  .connect("mongodb://127.0.0.1:27017/food_recipe_app")
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log("Server running on http://localhost:5000");
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });