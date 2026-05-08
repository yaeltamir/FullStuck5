import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { apiGet } from "../api/api";

export default function Register() {
  const [step, setStep] = useState(1);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verify, setVerify] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function checkBasicDetails(e) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim() || !verify.trim()) {
      setError("יש למלא את כל השדות");
      return;
    }

    if (password !== verify) {
      setError("הסיסמאות אינן תואמות");
      return;
    }

    const serverUsers = await apiGet("/users");
    const localUsers = JSON.parse(localStorage.getItem("users")) || [];

    const exists = [...serverUsers, ...localUsers].some(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );

    if (exists) {
      setError("שם המשתמש כבר קיים");
      return;
    }

    setStep(2);
  }

  function finishRegister(e) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim()) {
      setError("שם מלא ואימייל הם שדות חובה");
      return;
    }

    const newUser = {
      id: Date.now(),
      username,
      password: password,
      name,
      email,
      phone,
      address: {
        street: "",
        city: "",
      },
      company: {
        name: "",
      },
    };

    const localUsers = JSON.parse(localStorage.getItem("users")) || [];
    localStorage.setItem("users", JSON.stringify([...localUsers, newUser]));
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    navigate("/home");
  }

  return (
    <div>
      <h1>Register</h1>

      {step === 1 && (
        <form onSubmit={checkBasicDetails}>
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

          <button type="submit">Continue</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={finishRegister}>
          <h2>Complete your details</h2>

          <input
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button type="submit">Register</button>
        </form>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
      <Link to="/login">Back to Login</Link>
    </div>
  );
}