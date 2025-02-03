// ProtectedRoute.jsx
import React from "react"
import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode";

// Fonction pour vérifier si l'utilisateur a le rôle requis ou un rôle supérieur
const hasRequiredRole = (userRole, requiredRole) => {
  const roleHierarchy = ["membre", "admin"]
  return roleHierarchy.indexOf(userRole) >= roleHierarchy.indexOf(requiredRole)
}

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("authToken")

  if (!token) {
    return <Navigate to="/login" />
  }

  let decodedToken
  try {
    decodedToken = jwtDecode(token)
  } catch (err) {
    console.error("Erreur lors du décodage du token :", err)
    return <Navigate to="/login" />
  }

  const userRole = decodedToken.role

  if (!hasRequiredRole(userRole, requiredRole)) {
    return <Navigate to="/" /> // Redirection vers la page d'accueil si accès refusé
  }

  return children
}

export default ProtectedRoute
