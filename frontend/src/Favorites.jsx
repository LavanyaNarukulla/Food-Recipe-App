import RecipeCard from "./components/RecipeCard";

function Favorites({ favorites, onRemove, onBack, onViewRecipe }) {
  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">❤️ Favorite Recipes</h1>
        <p className="page-sub">You have {favorites.length} favorite recipe(s).</p>

        {favorites.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🍽️</div>
            <h3>No favorites yet</h3>
            <p>Tap the heart on any recipe to save it here.</p>
            {onBack && (
              <button className="btn-back" onClick={onBack}>
                ← Back to Recipes
              </button>
            )}
          </div>
        ) : (
          <div className="recipe-list">
            {favorites.map((recipe) => (
              <div className="recipe-item" key={recipe._id}>
                <RecipeCard
                  name={recipe.name}
                  time={`${recipe.cookingTime} minutes`}
                  difficulty={recipe.difficulty}
                  image={recipe.image}
                  category={recipe.category}
                  isFavorite={true}
                  onFavorite={() => onRemove && onRemove(recipe._id)}
                  onViewRecipe={() => onViewRecipe && onViewRecipe(recipe)}
                />
                <button
                  className="delete-button"
                  onClick={() => onRemove && onRemove(recipe._id)}
                >
                  🗑️ Remove from Favorites
                </button>
              </div>
            ))}
          </div>
        )}

        {onBack && favorites.length > 0 && (
          <div className="favorites-footer">
            <button className="btn-back" onClick={onBack}>
              ← Back to Recipes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;