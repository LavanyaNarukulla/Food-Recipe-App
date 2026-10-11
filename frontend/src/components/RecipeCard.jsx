import "./RecipeCard.css";

function RecipeCard({
  name,
  time,
  difficulty,
  image,
  category,
  owner,
  isOwner,
  onViewRecipe,
  onEdit,
  onFavorite,
  isFavorite,
}) {
  return (
    <div className="recipe-card">
      <div className="recipe-card-img">
        {image ? (
          <img
            src={image}
            alt={name}
            referrerpolicy="no-referrer"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const ph = e.currentTarget.parentElement.querySelector(".recipe-card-placeholder");
              if (ph) ph.style.display = "flex";
            }}
          />
        ) : null}
        <div className="recipe-card-placeholder">
          <span>🍽️</span>
        </div>
        <span className="recipe-card-badge">{category}</span>
      </div>

      <div className="recipe-card-body">
        <h3 className="recipe-card-title">{name}</h3>
        <div className="recipe-card-meta">
          <span>⏱ {time}</span>
          <span className={`diff diff-${difficulty.toLowerCase()}`}>
            {difficulty}
          </span>
        </div>

        <div className="recipe-card-actions">
          <button className="btn-view" onClick={onViewRecipe}>
            View Recipe
          </button>
          <button
            className={`btn-fav ${isFavorite ? "is-fav" : ""}`}
            onClick={onFavorite}
            aria-pressed={isFavorite}
          >
            {isFavorite ? "❤️ Favorited" : "🤍 Favorite"}
          </button>
        </div>

        {isOwner && (
          <div className="recipe-owner-actions">
            {onEdit && (
              <button className="btn-edit" onClick={onEdit}>
                ✏️ Edit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipeCard;