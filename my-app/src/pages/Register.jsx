import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verify, setVerify] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function handleRegister(e) {
    e.preventDefault();
    setError("");

    if (!username || !password || !verify) {
      setError("All fields required");
      return;
    }

    if (password !== verify) {
      setError("Passwords do not match");
      return;
    }

    // בדיקה אם המשתמש קיים (אצלנו בלוקאל)
    const existing = JSON.parse(localStorage.getItem("users")) || [];

    if (existing.find((u) => u.username === username)) {
      setError("User already exists");
      return;
    }

    const newUser = {
      id: Date.now(),
      username,
      website: password, // כמו ב-login
      name: username,
    };

    localStorage.setItem("users", JSON.stringify([...existing, newUser]));
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    navigate("/home");
  }

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleRegister}>
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

        <input
          placeholder="Verify Password"
          value={verify}
          onChange={(e) => setVerify(e.target.value)}
        />

        <button type="submit">Register</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}