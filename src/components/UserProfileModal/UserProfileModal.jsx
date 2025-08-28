import { useEffect, useState } from "react"
import axios from "axios"
import "./UserProfileModal.scss"
import PropTypes from "prop-types"

export default function UserProfileModal({ user, onClose }) {
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Fonction pour récupérer les données utilisateur depuis l'API
    const fetchUserData = async () => {
      try {
        const userId = typeof user === "object" && user !== null ? user.id : user
        const token = localStorage.getItem("authToken")
        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/utilisateurs/${userId}`,
          { headers }
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
    <div
      className="userProfileModal"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="closeButton">
          X
        </button>
        {userData && (
          <>
            {userData.photo_url && (
              <img
                src={userData.photo_url}
                alt={userData.pseudo}
                className="profilePhoto"
              />
            )}
            <h2>{userData.prenom}</h2>
            <p>Pseudo: {userData.pseudo}</p>
            <p>Bio: {userData.bio || "Aucune bio disponible."}</p>
          </>
        )}
      </div>
    </div>
  )
}

UserProfileModal.propTypes = {
  user: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.shape({ id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]) }),
  ]).isRequired,
  onClose: PropTypes.func.isRequired,
}
