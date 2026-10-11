import { useState, useEffect } from "react";
import "./AddRecipe.css";
import auth from "./auth";

function AddRecipe({ editRecipe, onSaved, onCancel }) {
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [category, setCategory] = useState("Vegetarian");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditing = !!editRecipe;

  useEffect(() => {
    if (editRecipe) {
      setName(editRecipe.name || "");
      setIngredients((editRecipe.ingredients || []).join(", "));
      setInstructions((editRecipe.instructions || []).join("\n"));
      setCookingTime(editRecipe.cookingTime || "");
      setDifficulty(editRecipe.difficulty || "Easy");
      setCategory(editRecipe.category || "Vegetarian");
      setImage(editRecipe.image || "");
      setMessage("");
    } else {
      setName("");
      setIngredients("");
      setInstructions("");
      setCookingTime("");
      setDifficulty("Easy");
      setCategory("Vegetarian");
      setImage("");
      setMessage("");
    }
  }, [editRecipe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const recipeData = {
      name,
      ingredients: ingredients
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      instructions: instructions
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      cookingTime: Number(cookingTime),
      difficulty,
      category,
      image,
    };

    const currentUser = auth.getUser();
    if (!currentUser) {
      setMessage("Please log in before adding a recipe.");
      setLoading(false);
      return;
    }

    const url = isEditing
      ? auth.apiUrl(`/api/recipes/${editRecipe._id}`)
      : auth.apiUrl("/api/recipes");
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: auth.authHeaders(),
        body: JSON.stringify(recipeData),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Could not save recipe.");
        setLoading(false);
        return;
      }

      setMessage(
        isEditing
          ? "Recipe updated successfully!"
          : "Recipe added successfully!"
      );

      if (!isEditing) {
        setName("");
        setIngredients("");
        setInstructions("");
        setCookingTime("");
        setDifficulty("Easy");
        setCategory("Vegetarian");
        setImage("");
      }

      if (onSaved) {
        onSaved(data.recipe || recipeData);
      }
    } catch {
      setMessage("Could not connect to the backend.");
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">
          {isEditing ? "✏️ Edit Recipe" : "➕ Add New Recipe"}
        </h1>
        <p className="page-sub">
          {isEditing
            ? "Update your recipe details below."
            : "Share your delicious recipe with the community."}
        </p>

        <form onSubmit={handleSubmit} className="recipe-form">
          <div className="field">
            <label htmlFor="r-name">Recipe Name</label>
            <input
              id="r-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Example: Vegetable Biryani"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="r-ingredients">Ingredients (comma separated)</label>
            <textarea
              id="r-ingredients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Rice, Carrot, Onion, Oil"
              rows={3}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="r-instructions">Instructions (one step per line)</label>
            <textarea
              id="r-instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder={"Wash the rice.\nCook the vegetables.\nMix and serve."}
              rows={4}
              required
            />
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="r-time">Cooking Time (minutes)</label>
              <input
                id="r-time"
                type="number"
                min="1"
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="r-difficulty">Difficulty</label>
              <select
                id="r-difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="r-category">Category</label>
              <select
                id="r-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Desserts">Desserts</option>
                <option value="Snacks">Snacks</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="r-image">Image URL (optional)</label>
            <input
              id="r-image"
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/recipe.jpg"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading
                ? isEditing
                  ? "Saving..."
                  : "Adding..."
                : isEditing
                ? "Save Changes"
                : "Add Recipe"}
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn-back"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {message && (
          <p
            className={`form-msg ${
              message.includes("successfully") ? "ok" : "err"
            }`}
            role="status"
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default AddRecipe;