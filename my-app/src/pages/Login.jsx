import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await response.json();

    const foundUser = users.find(
      (user) => user.username === username && user.website === password
    );

    if (!foundUser) {
      setError("שם משתמש או סיסמה אינם נכונים");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(foundUser));
    navigate("/home");
  }

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>

      {error && <p>{error}</p>}

      <Link to="/register">Register</Link>
    </div>
  );
}