import {
  Outlet,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useEffect, useState } from "react";

export default function Home() {

  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {

    const savedUser =
      localStorage.getItem("currentUser");

    if (!savedUser) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(savedUser));

  }, [navigate]);

  function logout() {

    localStorage.removeItem("currentUser");

    navigate("/login");
  }

  function editUser() {

    const newName = prompt(
      "Name:",
      user.name
    );

    const newEmail = prompt(
      "Email:",
      user.email
    );

    const newPhone = prompt(
      "Phone:",
      user.phone
    );

    if (
      !newName?.trim() ||
      !newEmail?.trim()
    ) {
      return;
    }

    const updatedUser = {
      ...user,
      name: newName,
      email: newEmail,
      phone: newPhone,
    };

    setUser(updatedUser);

    localStorage.setItem(
      "currentUser",
      JSON.stringify(updatedUser)
    );

    const users =
      JSON.parse(
        localStorage.getItem("users")
      ) || [];

    const updatedUsers =
      users.map((u) =>
        u.id === updatedUser.id
          ? updatedUser
          : u
      );

    localStorage.setItem(
      "users",
      JSON.stringify(updatedUsers)
    );
  }

  if (!user) return null;

  return (
    <div className="layout">

      <aside className="sidebar">

        <h2>Dashboard</h2>

        <Link to="/home">
          Home
        </Link>

        <Link to="/todos">
          Todos
        </Link>

        <Link to="/posts">
          Posts
        </Link>

        <Link to="/albums">
          Albums
        </Link>

        <button onClick={logout}>
          Logout
        </button>

      </aside>

      <main className="content">

        <h1>
          Welcome {user.name}
        </h1>

        <p>
          Current Page:
          {location.pathname}
        </p>

        {location.pathname === "/home" && (

          <div className="card">

            <h2>User Info</h2>

            <p>
              <b>Name:</b> {user.name}
            </p>

            <p>
              <b>Email:</b> {user.email}
            </p>

            <p>
              <b>Phone:</b> {user.phone}
            </p>

            <p>
              <b>Username:</b> {user.username}
            </p>

            <button
              onClick={editUser}
            >
              Edit Profile
            </button>

          </div>
        )}

        <Outlet />

      </main>

    </div>
  );
}