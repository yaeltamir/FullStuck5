import { useEffect, useState } from "react";

import {
  apiGet,
  apiPost,
  apiDelete,
  apiPut,
} from "../api/api";

export default function Todos() {

  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("id");

  useEffect(() => {

    const user = JSON.parse(
      localStorage.getItem("currentUser")
    );

    if (!user) return;

    loadTodos(user.id);

  }, []);

  async function loadTodos(userId) {

    const data = await apiGet(
      `/todos?userId=${userId}`
    );

    setTodos(data);
  }

  // ➕ ADD
  async function addTodo() {

    if (!newTodo.trim()) return;

    const user = JSON.parse(
      localStorage.getItem("currentUser")
    );

    const todo = {
      userId: user.id,
      title: newTodo,
      completed: false,
    };

    const savedTodo = await apiPost(
      "/todos",
      todo
    );

    setTodos((prev) => [
      savedTodo,
      ...prev,
    ]);

    setNewTodo("");
  }

  // ❌ DELETE
  async function deleteTodo(id) {

    await apiDelete(`/todos/${id}`);

    setTodos((prev) =>
      prev.filter((t) => t.id !== id)
    );
  }

  // ✔️ TOGGLE
  async function toggleTodo(id) {

    const todo = todos.find(
      (t) => t.id === id
    );

    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
    };

    await apiPut(
      `/todos/${id}`,
      updatedTodo
    );

    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? updatedTodo
          : t
      )
    );
  }

  // ✏️ UPDATE
  async function updateTodo(id) {

    const todo = todos.find(
      (t) => t.id === id
    );

    const newTitle = prompt(
      "Edit todo:",
      todo.title
    );

    if (!newTitle?.trim()) return;

    const updatedTodo = {
      ...todo,
      title: newTitle,
    };

    await apiPut(
      `/todos/${id}`,
      updatedTodo
    );

    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? updatedTodo
          : t
      )
    );
  }

  // 🔍 FILTER + SORT
  const processedTodos = todos

    .filter((t) =>
      t.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      String(t.id).includes(search)
    )

    .filter((t) => {

      if (filter === "completed") {
        return t.completed;
      }

      if (filter === "active") {
        return !t.completed;
      }

      return true;
    })

    .sort((a, b) => {

      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === "completed") {
        return a.completed - b.completed;
      }

      return a.id - b.id;
    });

  return (
    <div>

      <h1>Todos</h1>

      {/* ADD */}
      <input
        value={newTodo}
        onChange={(e) =>
          setNewTodo(e.target.value)
        }
        placeholder="Add todo..."
      />

      <button onClick={addTodo}>
        Add
      </button>

      <hr />

      {/* SEARCH */}
      <input
        placeholder="Search..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      {/* FILTER */}
      <select
        onChange={(e) =>
          setFilter(e.target.value)
        }
      >
        <option value="all">
          All
        </option>

        <option value="completed">
          Completed
        </option>

        <option value="active">
          Active
        </option>
      </select>

      {/* SORT */}
      <select
        onChange={(e) =>
          setSortBy(e.target.value)
        }
      >
        <option value="id">
          ID
        </option>

        <option value="title">
          Title
        </option>

        <option value="completed">
          Completed
        </option>
      </select>

      <hr />

      {/* LIST */}
      {processedTodos.map((todo) => (

        <div key={todo.id}>

          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() =>
              toggleTodo(todo.id)
            }
          />

          <span
            style={{
              textDecoration:
                todo.completed
                  ? "line-through"
                  : "none",
            }}
          >
            {todo.title}
          </span>

          <button
            onClick={() =>
              updateTodo(todo.id)
            }
          >
            Edit
          </button>

          <button
            onClick={() =>
              deleteTodo(todo.id)
            }
          >
            ❌
          </button>

        </div>
      ))}

    </div>
  );
}