import React from "react"
import { useNavigate } from "react-router-dom"

/**
 * Import du SCSS spécifique au bouton
 * (Assure-toi que la config Vite ou React gère bien le SCSS)
 */
import "./LogoutButton.scss"

// Import de l'icône
import iconOff from "../../assets/pics/iconsOff.png"

const LogoutButton = () => {
  const navigate = useNavigate()

  /**
   * Fonction de déconnexion :
   * - Supprime le token
   * - Redirige vers la page d'accueil
   */
  const handleLogout = () => {
    localStorage.removeItem("authToken")
    navigate("/")
  }

  return (
    <button className="logout-button" onClick={handleLogout}>
      {/* 
        On affiche l'icône comme une simple <img>.
        On peut ajouter un alt descriptif. 
      */}
      <img src={iconOff} alt="Déconnexion" className="logout-icon" />
    </button>
  )
}

export default LogoutButton
