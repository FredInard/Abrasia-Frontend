import React, { useState, useEffect } from "react"
import axios from "axios"
import UserProfileModal from "../UserProfileModal/UserProfileModal" // Import de la modale de profil
import "./ParticipantsList.scss"

const ParticipantsList = ({
  partyId,
  isUpdated,
  isCreator,
  onParticipantRemoved,
}) => {
  const [participants, setParticipants] = useState([])
  const [selectedParticipant, setSelectedParticipant] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  console.info("selectedParticipant de ParticipantsList", selectedParticipant)

  useEffect(() => {
    setLoading(true) // Active le chargement avant la requête
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/participations/${partyId}`)
      .then((res) => {
        console.info("Données reçues de l'API :", res.data)
        setParticipants(Array.isArray(res.data) ? res.data : [])
        setError(null) // Réinitialise l'erreur si les données sont bien reçues
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des participants :", err)
        setError("Il n'y a pas encore d'aventuriers")
      })
      .finally(() => {
        setLoading(false) // Arrête le chargement après la réponse de l'API
      })
  }, [partyId, isUpdated])

  // Fonction pour ouvrir la modale avec le participant sélectionné
  const handleProfileClick = (participant) => {
    setSelectedParticipant(participant.id)
  }

  // Fonction pour fermer la modale
  const closeModal = () => {
    setSelectedParticipant(null)
  }

  // Fonction pour supprimer un participant
  const handleRemoveParticipant = async (participantId) => {
    if (!isCreator) return // Seul le MJ peut supprimer un participant

    try {
      await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/participations/${partyId}/${participantId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      )

      // Mettre à jour la liste des participants localement
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p.id !== participantId)
      )

      // Optionnel : Notifier l'utilisateur
      alert("Participant supprimé avec succès.")

      // Appeler la fonction de rafraîchissement passée en prop
      if (typeof onParticipantRemoved === "function") {
        onParticipantRemoved() // Rafraîchit CarpoolList et MealList
      }
    } catch (err) {
      console.error(
        `Erreur lors de la suppression du participant ${participantId} :`,
        err
      )
      setError("Impossible de supprimer ce participant. Veuillez réessayer.")
    }
  }

  if (loading) return <p>Chargement des participants...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <div className="participantsListBox">
        {participants.length > 0 ? (
          participants.map((participant) => (
            <div className="participantsAffichage" key={participant.id}>
              <img
                src={`${
                  import.meta.env.VITE_BACKEND_URL
                }/${participant.photo_profil.replace(/\\/g, "/")}`}
                alt="Photo de profil participant"
                className="ProfilPhoto"
                onClick={() => handleProfileClick(participant)} // Gestionnaire de clic
              />
              {participant.pseudo}
              {isCreator && (
                <button
                  className="remove-participant-btn"
                  onClick={() => handleRemoveParticipant(participant.id)}
                  aria-label={`Supprimer ${participant.pseudo}`}
                >
                  Supprimer
                </button>
              )}
            </div>
          ))
        ) : (
          <p>Aucun participant disponible pour cette partie.</p>
        )}
      </div>

      {/* Afficher la fiche descriptive du participant dans une modale si sélectionné */}
      {selectedParticipant && (
        <UserProfileModal user={selectedParticipant} onClose={closeModal} />
      )}
    </div>
  )
}

export default ParticipantsList
