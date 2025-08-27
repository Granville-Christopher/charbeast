// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./userpages/Home";
import Admin from "./admin/Admin";
import Login from "./admin/Login";
import Register from "./admin/Register";
import ProtectedRoute from "./components/protectedroute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />

        <Route path="/admin" element={<ProtectedRoute component={Admin} />} />
      </Routes>
    </Router>
  );
}

export default App;
