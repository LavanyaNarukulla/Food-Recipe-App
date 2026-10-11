import { useState } from "react";
import "../Auth.css";
import auth from "../auth";

function Login({ onAuthChange, onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    try {
      const response = await fetch(auth.apiUrl("/api/users/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        auth.saveUser(data.user, data.token);
        if (onAuthChange) onAuthChange(data.user);
        if (onNavigate) onNavigate("/");
        alert(`Welcome, ${data.user.name}! Login successful.`);
        setEmail("");
        setPassword("");
      } else {
        setError(data.message || "Login failed.");
      }
    } catch {
      setError("Could not connect to the server.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>🔐 Login</h1>
        <p className="auth-sub">Welcome back! Sign in to your account.</p>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleLogin} className="auth-form">
          <div className="field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;