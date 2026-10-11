
import { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import RecipeCard from "./components/RecipeCard";
import RecipeDetail from "./components/RecipeDetail";
import Favorites from "./Favorites";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddRecipe from "./AddRecipe";
import auth from "./auth";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maxTime, setMaxTime] = useState("Any");
  const [difficulty, setDifficulty] = useState("Any");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(window.location.pathname);
  const [user, setUser] = useState(auth.getUser());
  const recipeDetailsRef = useRef(null);

  useEffect(() => {
    if (selectedRecipe && recipeDetailsRef.current) {
      const timer = setTimeout(() => {
        const element = recipeDetailsRef.current;
        const rect = element.getBoundingClientRect();
        const navbarHeight = 72;
        const targetY = window.scrollY + rect.top - navbarHeight;
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [selectedRecipe]);

  useEffect(() => {
    let active = true;

    const loadRecipes = async () => {
      try {
        const response = await fetch(auth.apiUrl("/api/recipes"));

        if (!response.ok) {
          throw new Error("Failed to load recipes.");
        }

        const data = await response.json();
        if (active) {
          setRecipes(data);
          setError("");
        }
      } catch {
        if (active) {
          setError(
            "Could not load recipes. Please check the backend server."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadRecipes();

    return () => {
      active = false;
    };
  }, []);

  // Load favorites from MongoDB when a user logs in.
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }

    let active = true;
    const loadFavorites = async () => {
      try {
        const response = await fetch(
          auth.apiUrl("/api/favorites"),
          { headers: auth.authHeaders() }
        );
        if (!response.ok) {
          throw new Error("Failed to load favorites.");
        }
        const data = await response.json();
        if (active) {
          setFavorites(data);
        }
      } catch {
        // Fall back silently to an empty list if the backend is unavailable.
        if (active) {
          setFavorites([]);
        }
      }
    };

    loadFavorites();

    return () => {
      active = false;
    };
  }, [user]);

  const syncFavorites = async (recipeId, action) => {
    if (!user) return null;
    try {
      let response;
      if (action === "add") {
        // Backend route: POST /api/favorites with { recipeId } in the body.
        response = await fetch(auth.apiUrl("/api/favorites"), {
          method: "POST",
          headers: auth.authHeaders(),
          body: JSON.stringify({ recipeId }),
        });
      } else {
        // Backend route: DELETE /api/favorites/:recipeId
        response = await fetch(
          auth.apiUrl(`/api/favorites/${recipeId}`),
          { method: "DELETE", headers: auth.authHeaders() }
        );
      }
      if (!response.ok) {
        throw new Error("Failed to sync favorites.");
      }
      const data = await response.json();
      setFavorites(data.favorites || []);
      return data.favorites || [];
    } catch {
      return null;
    }
  };

  const toggleFavorite = async (recipe) => {
    const alreadyFavorite = favorites.some(
      (favorite) => favorite._id === recipe._id
    );

    if (user) {
      // Persist to MongoDB.
      const synced = await syncFavorites(recipe._id, alreadyFavorite ? "remove" : "add");
      if (synced) return;
    }

    // Fallback: in-memory storage (lost on refresh).
    if (alreadyFavorite) {
      setFavorites((previous) =>
        previous.filter((favorite) => favorite._id !== recipe._id)
      );
    } else {
      setFavorites((previous) => [...previous, recipe]);
    }
  };

  const removeFavorite = async (recipeId) => {
    if (user) {
      const synced = await syncFavorites(recipeId, "remove");
      if (synced) return;
    }

    setFavorites((previous) =>
      previous.filter((favorite) => favorite._id !== recipeId)
    );
  };

  const deleteRecipe = async (recipeId) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) {
      return;
    }

    try {
      const response = await fetch(
        auth.apiUrl(`/api/recipes/${recipeId}`),
        {
          method: "DELETE",
          headers: auth.authHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        window.alert(data.message || "Failed to delete recipe.");
        return;
      }

      setRecipes((previous) =>
        previous.filter((recipe) => recipe._id !== recipeId)
      );

      setFavorites((previous) =>
        previous.filter((recipe) => recipe._id !== recipeId)
      );

      setSelectedRecipe((previous) =>
        previous?._id === recipeId ? null : previous
      );

      window.alert("Recipe deleted successfully!");
    } catch {
      window.alert("Could not connect to the backend server.");
    }
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      q === "" ||
      recipe.name.toLowerCase().includes(q) ||
      (recipe.ingredients || []).some((ing) =>
        ing.toLowerCase().includes(q)
      );

    const matchesCategory =
      category === "All" || recipe.category === category;

    const matchesTime =
      maxTime === "Any" ||
      (recipe.cookingTime != null && recipe.cookingTime <= Number(maxTime));

    const matchesDifficulty =
      difficulty === "Any" || recipe.difficulty === difficulty;

    return matchesSearch && matchesCategory && matchesTime && matchesDifficulty;
  });

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setMaxTime("Any");
    setDifficulty("Any");
  };

  const activeFilters =
    search.trim() !== "" ||
    category !== "All" ||
    maxTime !== "Any" ||
    difficulty !== "Any";

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setPage(path);
    setSelectedRecipe(null);
  };

  const goHome = () => navigate("/");
  const goFavorites = () => navigate("/favorites");
  const goLogin = () => navigate("/login");
  const goRegister = () => navigate("/register");
  const goAddRecipe = () => {
    setEditingRecipe(null);
    navigate("/add-recipe");
  };

  const handleLogout = () => {
    auth.clearUser();
    setUser(null);
    setFavorites([]);
    navigate("/");
  };

  const handleAuthChange = (updatedUser) => {
    if (updatedUser) {
      setUser(updatedUser);
    } else {
      setUser(auth.getUser());
    }
  };

  // Redirect logged-in users away from the login/register pages.
  useEffect(() => {
    if (user && (page === "/login" || page === "/register")) {
      navigate("/");
    }
  }, [user, page]);

  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    navigate("/add-recipe");
  };

  const handleSaveRecipe = (savedRecipe) => {
    if (editingRecipe) {
      setRecipes((previous) =>
        previous.map((recipe) =>
          recipe._id === savedRecipe._id ? savedRecipe : recipe
        )
      );
    } else {
      setRecipes((previous) => [savedRecipe, ...previous]);
    }
    setEditingRecipe(null);
    navigate("/");
  };

  return (
    <div>
      <Navbar onNavigate={navigate} user={user} onLogout={handleLogout} />

      {page === "/login" ? (
        <main>
          <Login onAuthChange={handleAuthChange} onNavigate={navigate} />
          <button onClick={goRegister}>👤 Create Account</button>
          <br /><br />
          <button onClick={goHome}>🏠 Back to Home</button>
        </main>
      ) : page === "/register" ? (
        <main>
          <Register onAuthChange={handleAuthChange} onNavigate={navigate} />
          <button onClick={goLogin}>
            🔐 Already have an account? Login
          </button>
          <br /><br />
          <button onClick={goHome}>🏠 Back to Home</button>
        </main>
      ) : page === "/favorites" ? (
        <main>
          <Favorites
            favorites={favorites}
            onRemove={removeFavorite}
            onBack={goHome}
            onViewRecipe={setSelectedRecipe}
          />
          <button onClick={goHome}>🏠 Back to Home</button>
        </main>
      ) : page === "/add-recipe" ? (
        <main>
          <AddRecipe
            editRecipe={editingRecipe}
            onSaved={handleSaveRecipe}
            onCancel={() => setEditingRecipe(null)}
          />
          <button onClick={goHome}>🏠 Back to Home</button>
        </main>
      ) : (
        <main>
          <h1>🍲 Food Recipe App</h1>
          <p>
            Discover delicious recipes and learn how to cook them step by step.
          </p>

          <div className="filter-bar">
            <input
              type="text"
              placeholder="🔍 Search by name or ingredient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="filter-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="All">All</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Desserts">Desserts</option>
                <option value="Snacks">Snacks</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Max Cooking Time</label>
              <select value={maxTime} onChange={(e) => setMaxTime(e.target.value)}>
                <option value="Any">Any</option>
                <option value="15">≤ 15 min</option>
                <option value="30">≤ 30 min</option>
                <option value="45">≤ 45 min</option>
                <option value="60">≤ 60 min</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="Any">Any</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {activeFilters && (
              <button className="btn-clear" onClick={clearFilters}>
                ✕ Clear Filters
              </button>
            )}
          </div>

          {activeFilters && (
            <p className="filter-result">
              Showing {filteredRecipes.length} recipe
              {filteredRecipes.length === 1 ? "" : "s"} matching your filters.
            </p>
          )}

          <h2>Popular Recipes</h2>

          {loading ? (
            <p>Loading recipes...</p>
          ) : error ? (
            <p>{error}</p>
          ) : filteredRecipes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No recipes match your search</h3>
              <p>Try different keywords, a broader cooking time, or clear the filters.</p>
              {activeFilters && (
                <button className="btn-clear" onClick={clearFilters}>
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="recipe-list">
              {filteredRecipes.map((recipe) => {
                const isOwner =
                  user &&
                  recipe.owner &&
                  recipe.owner.toString() === user.id;

                return (
                  <div className="recipe-item" key={recipe._id}>
                    <RecipeCard
                      name={recipe.name}
                      time={`${recipe.cookingTime} minutes`}
                      difficulty={recipe.difficulty}
                      image={recipe.image}
                      category={recipe.category}
                      owner={recipe.owner}
                      isOwner={isOwner}
                      onViewRecipe={() => setSelectedRecipe(recipe)}
                      onEdit={() => handleEditRecipe(recipe)}
                      onFavorite={() => toggleFavorite(recipe)}
                      isFavorite={favorites.some(
                        (favorite) => favorite._id === recipe._id
                      )}
                    />

                    {isOwner && (
                      <button
                        className="delete-button"
                        onClick={() => deleteRecipe(recipe._id)}
                      >
                        🗑️ Delete Recipe
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <h2>❤️ Favorite Recipes</h2>
          <p>You have {favorites.length} favorite recipe(s).</p>

          <button onClick={goFavorites}>❤️ View All Favorites</button>
          <button onClick={goAddRecipe}>➕ Add Recipe</button>
          <button onClick={goLogin}>🔐 Login</button>
          <button onClick={goRegister}>👤 Register</button>

          {selectedRecipe && (
            <div
              className="recipe-details"
              ref={recipeDetailsRef}
              tabIndex={-1}
            >
              <RecipeDetail
                recipe={selectedRecipe}
                onBack={() => setSelectedRecipe(null)}
                onDelete={deleteRecipe}
              />
            </div>
          )}
        </main>
      )}
    </div>
  );
}

export default App;