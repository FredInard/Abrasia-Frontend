// src/App.jsx

import "./App.scss"
// import React from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import Home from "./pages/Home"
import CreateGame from "./pages/CreateGame"
import About from "./pages/Association"
import LoginSignup from "./pages/LoginSignup"
import Cgu from "./pages/Cgu"
import Profil from "./pages/Profil"
import AdminPage from "./pages/AdminPage" // Import de la page d'administration
import ProtectedRoute from "./ProtectedRoute"
import ResetPassword from "./pages/ResetPassword"

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques accessibles à tous */}
        <Route path="/" element={<Home />} />
        <Route path="/association" element={<About />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/Cgu" element={<Cgu />} />

        {/* Routes protégées accessibles uniquement aux utilisateurs authentifiés */}
        <Route
          path="/creer-partie"
          element={
            <ProtectedRoute requiredRole="membre">
              <CreateGame />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profil"
          element={
            <ProtectedRoute requiredRole="membre">
              <Profil />
            </ProtectedRoute>
          }
        />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Route protégée pour l'administrateur */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* Redirection si la route est incorrecte */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
