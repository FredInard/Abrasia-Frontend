import React, { useEffect, useState } from "react"
import axios from "axios"
import "./UserProfileModal.scss"

export default function UserProfileModal({ user, onClose }) {
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Fonction pour récupérer les données utilisateur depuis l'API
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/utilisateurs/${user}`
        )
        setUserData(response.data) // Mettre à jour avec les données récupérées
        setError(null) // Réinitialise l'erreur en cas de succès
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données utilisateur :",
          error
        )
        setError("Impossible de charger les informations utilisateur.")
      } finally {
        setIsLoading(false) // Fin du chargement
      }
    }

    if (user) {
      fetchUserData()
    }
  }, [user])

  // Affichage en cas de chargement
  if (isLoading) {
    return <div className="loading">Chargement des données utilisateur...</div>
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={onClose} className="closeButton">
          Fermer
        </button>
      </div>
    )
  }

  // Rendu principal une fois les données chargées
  return (
    <div className="userProfileModal">
      <div className="modalContent">
        <button onClick={onClose} className="closeButton">
          X
        </button>
        {userData && (
          <>
            <img
              src={`${
                import.meta.env.VITE_BACKEND_URL
              }/${userData.photo_profil.replace(/\\/g, "/")}`}
              alt={userData.pseudo}
              className="profilePhoto"
            />
            <h2>{userData.prenom}</h2>
            <p>Pseudo: {userData.pseudo}</p>
            <p>Bio: {userData.bio || "Aucune bio disponible."}</p>
          </>
        )}
      </div>
    </div>
  )
}
