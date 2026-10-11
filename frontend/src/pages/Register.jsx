import { useState } from "react";
import "../Auth.css";
import auth from "../auth";

function Register({ onAuthChange, onNavigate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (name === "" || email === "" || password === "") {
      setError("Please fill all the fields.");
      return;
    }
    try {
      const response = await fetch(auth.apiUrl("/api/users/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        auth.saveUser(data.user, data.token);
        if (onAuthChange) onAuthChange(data.user);
        if (onNavigate) onNavigate("/");
        alert("Registration successful!");
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setError(data.message);
      }
    } catch {
      setError("Could not connect to the server.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>👤 Create Account</h1>
        <p className="auth-sub">Join us and start exploring delicious recipes.</p>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleRegister} className="auth-form">
          <div className="field">
            <label htmlFor="reg-name">Name</label>
            <input
              id="reg-name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;