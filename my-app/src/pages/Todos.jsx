import { useEffect, useState } from "react";
import { apiGet } from "../api/api";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("id");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return;

    loadTodos(user.id);
  }, []);

  async function loadTodos(userId) {
    const data = await apiGet(`/todos?userId=${userId}`);
    setTodos(data);
  }

  // ➕ הוספה
  function addTodo() {
    if (!newTodo.trim()) return;

    const todo = {
      id: Date.now(),
      title: newTodo,
      completed: false,
    };

    setTodos([todo, ...todos]);
    setNewTodo("");
  }

  // ❌ מחיקה
  function deleteTodo(id) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  // ✔️ שינוי מצב
  function toggleTodo(id) {
    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  }

  // 🔍 עיבוד חכם (ללא fetch!)
  const processedTodos = todos
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
    .filter((t) => {
      if (filter === "completed") return t.completed;
      if (filter === "active") return !t.completed;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "completed") return a.completed - b.completed;
      return a.id - b.id;
    });

  return (
    <div>
      <h1>Todos</h1>

      {/* ➕ הוספה */}
      <input
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add todo..."
      />
      <button onClick={addTodo}>Add</button>

      <hr />

      {/* 🔍 חיפוש */}
      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 🎯 סינון */}
      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="active">Active</option>
      </select>

      {/* 🔃 מיון */}
      <select onChange={(e) => setSortBy(e.target.value)}>
        <option value="id">ID</option>
        <option value="title">Title</option>
        <option value="completed">Completed</option>
      </select>

      <hr />

      {/* 📋 רשימה */}
      {processedTodos.map((todo) => (
        <div key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />

          <span
            style={{
              textDecoration: todo.completed ? "line-through" : "none",
            }}
          >
            {todo.title}
          </span>

          <button onClick={() => deleteTodo(todo.id)}>❌</button>
        </div>
      ))}
    </div>
  );
}