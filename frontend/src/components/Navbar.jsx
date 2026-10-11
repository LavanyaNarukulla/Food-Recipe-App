import { useState } from "react";
import "./Navbar.css";

function Navbar({ onNavigate, user, onLogout }) {
  const [open, setOpen] = useState(false);

  const navigate = (path) => {
    if (onNavigate) {
      onNavigate(path);
    }
    setOpen(false);
  };

  const goHome = () => navigate("/");
  const goFavorites = () => navigate("/favorites");
  const goLogin = () => navigate("/login");
  const goRegister = () => navigate("/register");

  const handleLogout = () => {
    if (onLogout) onLogout();
    setOpen(false);
  };

  const path = window.location.pathname;
  const initials = user
    ? (user.name || user.email || "?")
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  return (
    <nav className="nav">
      <div className="nav-inner">
        <a className="nav-brand" href="/" onClick={(e) => { e.preventDefault(); goHome(); }}>
          <span className="logo">🍳</span>
          <span>Food Recipe App</span>
        </a>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? "✕" : "☰"}
        </button>

        <div className={`nav-links ${open ? "open" : ""}`}>
          <a
            href="/"
            className={path === "/" ? "active" : ""}
            onClick={(e) => { e.preventDefault(); goHome(); }}
          >
            Home
          </a>
          <a
            href="/favorites"
            className={path === "/favorites" ? "active" : ""}
            onClick={(e) => { e.preventDefault(); goFavorites(); }}
          >
            Favorites ❤️
          </a>

          {user ? (
            <>
              <span className="nav-user">
                <span className="nav-avatar">{initials}</span>
                <span className="nav-user-name">{user.name || user.email}</span>
              </span>
              <a
                href="/"
                className="nav-logout"
                onClick={(e) => { e.preventDefault(); handleLogout(); }}
              >
                🚪 Logout
              </a>
            </>
          ) : (
            <>
              <a
                href="/login"
                className={path === "/login" ? "active" : ""}
                onClick={(e) => { e.preventDefault(); goLogin(); }}
              >
                Login
              </a>
              <a
                href="/register"
                className={path === "/register" ? "active" : ""}
                onClick={(e) => { e.preventDefault(); goRegister(); }}
              >
                Register
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;