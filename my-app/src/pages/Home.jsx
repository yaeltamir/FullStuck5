import {
  Outlet,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import Modal from "../pages/Modal";

import {
  apiGet,
  apiPut,
} from "../api/api";

export default function Home() {

  const [user, setUser] =
    useState(null);

  const navigate =
    useNavigate();

  const location =
    useLocation();

  // ======================
  // PROFILE MODAL
  // ======================

  const [showProfileModal,
    setShowProfileModal] =
    useState(false);

  const [name,
    setName] =
    useState("");

  const [email,
    setEmail] =
    useState("");

  const [phone,
    setPhone] =
    useState("");

  useEffect(() => {

    const savedUser =
      localStorage.getItem(
        "currentUser"
      );

    if (!savedUser) {

      navigate("/login");

      return;
    }

    setUser(
      JSON.parse(savedUser)
    );

  }, [navigate]);

  // ======================
  // LOGOUT
  // ======================

  function logout() {

    localStorage.removeItem(
      "currentUser"
    );

    navigate("/login");
  }

  // ======================
  // OPEN EDIT MODAL
  // ======================

  function editUser() {

    setName(user.name);

    setEmail(user.email);

    setPhone(user.phone);

    setShowProfileModal(true);
  }

  // ======================
  // SAVE PROFILE
  // ======================

  async function saveProfile() {

    if (
      !name.trim() ||
      !email.trim()
    ) {
      return;
    }

    if (
      !email.includes("@")
    ) {

      alert(
        "Invalid email"
      );

      return;
    }

    const updatedUser = {

      ...user,

      name,

      email,

      phone,
    };

    await apiPut(
      `/users/${user.id}`,
      updatedUser
    );

    setUser(updatedUser);

    localStorage.setItem(
      "currentUser",
      JSON.stringify(
        updatedUser
      )
    );

    setShowProfileModal(false);
  }

  if (!user) return null;

  return (

    <div className="layout">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <h2>
          Dashboard
        </h2>

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

        <button
          onClick={logout}
        >
          Logout
        </button>

      </aside>

      {/* MAIN */}

      <main className="content">

        <h1>
          Welcome {user.name}
        </h1>

        <p>
          Current Page:
          {" "}
          {location.pathname}
        </p>

        {location.pathname ===
          "/home" && (

          <div className="card">

            <h2>
              User Info
            </h2>

            <p>
              <b>Name:</b>
              {" "}
              {user.name}
            </p>

            <p>
              <b>Email:</b>
              {" "}
              {user.email}
            </p>

            <p>
              <b>Phone:</b>
              {" "}
              {user.phone}
            </p>

            <p>
              <b>Username:</b>
              {" "}
              {user.username}
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

      {/* ====================== */}
      {/* PROFILE MODAL */}
      {/* ====================== */}

      <Modal
        isOpen={
          showProfileModal
        }
        onClose={() =>
          setShowProfileModal(
            false
          )
        }
      >

        <h2>
          Edit Profile
        </h2>

        <input
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
          placeholder="Name"
        />

        <br />
        <br />

        <input
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          placeholder="Email"
        />

        <br />
        <br />

        <input
          value={phone}
          onChange={(e) =>
            setPhone(
              e.target.value
            )
          }
          placeholder="Phone"
        />

        <br />
        <br />

        <button
          onClick={saveProfile}
        >
          Save
        </button>

      </Modal>

    </div>
  );
}