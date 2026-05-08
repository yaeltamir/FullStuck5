import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiGet } from "../api/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    setError("");

    try {
      const serverUsers = await apiGet("/users");

      const localUsers =
        JSON.parse(localStorage.getItem("users")) || [];

      const allUsers = [...serverUsers, ...localUsers];

      const foundUser = allUsers.find((user) => {
        if (user.password) {
          return (
            user.username === username &&
            user.password === password
          );
        }

        return (
          user.username === username &&
          user.website === password
        );
      });

      if (!foundUser) {
        setError("Invalid username or password");
        return;
      }

      localStorage.setItem(
        "currentUser",
        JSON.stringify(foundUser)
      );

      navigate("/home");
    } catch (err) {
      setError("Login failed");
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Login</h1>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">
            Login
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        <p>
          Don't have an account?
        </p>

        <Link to="/register">
          Register
        </Link>
      </div>
    </div>
  );
}