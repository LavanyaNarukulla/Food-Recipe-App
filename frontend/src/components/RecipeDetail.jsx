import "./RecipeDetail.css";

function RecipeDetail({ recipe, onBack, onDelete }) {
  if (!recipe) return null;

  return (
    <article className="recipe-detail">
      <div className="recipe-detail-hero">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.name}
            referrerpolicy="no-referrer"
            loading="eager"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const ph = e.currentTarget.parentElement.querySelector(
                ".recipe-detail-placeholder"
              );
              if (ph) ph.style.display = "flex";
            }}
          />
        ) : null}
        <div className="recipe-detail-placeholder">
          <span>🍽️</span>
        </div>
        <div className="recipe-detail-overlay">
          <span className="recipe-detail-badge">{recipe.category}</span>
        </div>
      </div>

      <div className="recipe-detail-body">
        <header className="recipe-detail-header">
          <h1 className="recipe-detail-title">{recipe.name}</h1>
          <div className="recipe-detail-meta">
            <span className="meta-chip">
              ⏱ {recipe.cookingTime} minutes
            </span>
            <span className={`meta-chip diff diff-${recipe.difficulty.toLowerCase()}`}>
              {recipe.difficulty}
            </span>
          </div>
        </header>

        <section className="recipe-detail-section">
          <h2 className="recipe-detail-section-title">🧂 Ingredients</h2>
          <ul className="recipe-detail-ingredients">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </section>

        <section className="recipe-detail-section">
          <h2 className="recipe-detail-section-title">👨‍🍳 Instructions</h2>
          <ol className="recipe-detail-instructions">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="recipe-detail-step">
                <span className="step-number">{index + 1}</span>
                <span className="step-text">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <footer className="recipe-detail-actions">
          <button className="btn-back" onClick={onBack}>
            ← Back to Recipes
          </button>
          {onDelete && (
            <button className="btn-delete" onClick={() => onDelete(recipe._id)}>
              🗑️ Delete Recipe
            </button>
          )}
        </footer>
      </div>
    </article>
  );
}

export default RecipeDetail;