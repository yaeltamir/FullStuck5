import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Todos from "./pages/Todos";
import Posts from "./pages/Posts";
import Albums from "./pages/Albums";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/todos" element={<Todos />} />
      <Route path="/posts" element={<Posts />} />
      <Route path="/albums" element={<Albums />} />
      <Route path="/todos" element={<h1>Todos Page</h1>} />
      <Route path="/posts" element={<h1>Posts Page</h1>} />
      <Route path="/albums" element={<h1>Albums Page</h1>} />
    </Routes>
  );
}

export default App;