const AUTH_KEY = "food_recipe_app_user";
const TOKEN_KEY = "food_recipe_app_token";

const auth = {
  /** Persist a user object and JWT token (returned by login/register). */
  saveUser(user, token) {
    if (!user) return;
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      }
    } catch {
      // ignore storage errors
    }
  },

  /** Get the currently logged-in user or null. */
  getUser() {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /** Get the stored JWT token or null. */
  getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  /** Clear the logged-in user and token. */
  clearUser() {
    try {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // ignore
    }
  },

  /** Whether a user is currently logged in. */
  isAuthenticated() {
    return this.getUser() !== null;
  },

  /** Build the full API URL for a relative path.
 *
 * Defaults to a relative URL (works through the Vite dev proxy and when the
 * frontend is served from the same host as the backend). Set
 * VITE_API_URL=http://localhost:5000 in the environment to point the built
 * app at a specific backend (e.g. when serving dist/ from a static server).
 */
apiUrl(path) {
    const base =
      (typeof import.meta !== "undefined" &&
        import.meta.env &&
        import.meta.env.VITE_API_URL) ||
      "";
    return `${base}${path}`;
  },

  /** Build the Authorization header for authenticated requests. */
  authHeaders(extra = {}) {
    const token = this.getToken();
    const headers = { "Content-Type": "application/json", ...extra };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  },
};

export default auth;