import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Home() {
  const [user, setUser] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");

    if (!savedUser) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(savedUser));
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("currentUser");
    navigate("/login");
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>

      <nav>
        <button onClick={() => setShowInfo(!showInfo)}>Info</button>

        <Link to="/todos">Todos</Link>{" | "}
        <Link to="/posts">Posts</Link>{" | "}
        <Link to="/albums">Albums</Link>{" | "}

        <button onClick={handleLogout}>Logout</button>
      </nav>

      {showInfo && (
        <div>
          <h2>User Info</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email || "N/A"}</p>
          <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
          <p><strong>Website:</strong> {user.website}</p>

          {user.address && (
            <>
              <h3>Address</h3>
              <p>{user.address.street}, {user.address.city}</p>
            </>
          )}

          {user.company && (
            <>
              <h3>Company</h3>
              <p>{user.company.name}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}