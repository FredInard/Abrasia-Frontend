import React, { useState, useEffect } from "react"
import axios from "axios"

import ParticipantsList from "../ParticipantsList/ParticipantsList"
import MealList from "../MealList/MealList"
import CarpoolList from "../CarpoolList/CarpoolList"
import CarpoolModal from "../Modal/ModalCarPool/CarpoolModal"
import MealModal from "../Modal/ModalMealList/MealModal"
import UserProfileModal from "../UserProfileModal/UserProfileModal"
import GameEditModal from "../Modal/GameEditModal/GameEditModal" // Import du nouveau composant

import "./GameDetails.scss"
import iconTime from "../../assets/pics/iconTime.svg"
import iconPlace from "../../assets/pics/iconPlaceMarker.svg"
import iconTeam from "../../assets/pics/iconTeam.svg"
import IconCar from "../../assets/pics/iconCar.svg"
import iconPizza from "../../assets/pics/iconPizza.svg"

const GameDetails = ({ partyId, game, onClose, onUpdate }) => {
  const [gameDetails, setGameDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isJoined, setIsJoined] = useState(false)
  const [user, setUser] = useState(null)
  const [isUpdated, setIsUpdated] = useState(false)
  const [isCarpoolModalOpen, setIsCarpoolModalOpen] = useState(false)
  const [isMealModalOpen, setIsMealModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Nouvel état pour stocker le nombre de participants
  const [participantsCount, setParticipantsCount] = useState(0)

  const refreshData = () => {
    setIsUpdated(!isUpdated) // Change la valeur pour forcer un rechargement
  }

  // Récupérer l'utilisateur connecté une fois au chargement
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]))
        setUser(decodedToken)
      } catch (err) {
        console.info("Erreur de déchiffrement du token :", err)
      }
    }
  }, [])

  // Charger les détails de la partie et vérifier l'inscription de l'utilisateur
  useEffect(() => {
    if (!partyId) return

    const fetchGameDetails = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/parties/${partyId}`
        )
        setGameDetails(res.data)

        // Vérifier si l'utilisateur est déjà inscrit à la partie
        if (user) {
          const participationRes = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/participations/${partyId}/${
              user.id
            }`
          )
          setIsJoined(participationRes.data.isJoined)
        }
      } catch (err) {
        setError("Erreur lors du chargement des détails de la partie.")
      } finally {
        setLoading(false)
      }
    }

    fetchGameDetails()
  }, [partyId, user?.id, isUpdated])

  // Charger la liste des participants pour connaître leur nombre
  useEffect(() => {
    if (!partyId) return

    const fetchParticipants = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/participations/${partyId}`
        )
        // res.data devrait être la liste des participants
        setParticipantsCount(res.data.length)
      } catch (err) {
        console.error("Erreur lors de la récupération des participants :", err)
      }
    }

    fetchParticipants()
  }, [partyId, isUpdated])

  // Calculer si la date de la partie est passée
  const isPast = gameDetails && new Date(gameDetails.date) < new Date()

  // Vérifier si l'utilisateur est le créateur de la partie
  const isCreator = user && user.id === gameDetails?.id_maitre_du_jeu

  // Vérifier si la partie est "full" en mode strict
  const isPartyFull =
    gameDetails?.strict_nb_joueurs &&
    participantsCount >= gameDetails?.nb_max_joueurs

  const handleJoinParty = async () => {
    if (!user) return

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/participations/${partyId}/${
          user.id
        }`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      )
      setIsJoined(true)
      setIsUpdated(!isUpdated) // Basculer isUpdated pour rafraîchir ParticipantsList
    } catch (err) {
      setError("Impossible de rejoindre la partie. Veuillez réessayer.")
      console.error(err)
    }
  }

  const handleLeaveParty = async () => {
    if (!user) return

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/participations/${partyId}/${
          user.id
        }`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      )
      setIsJoined(false)
      setIsUpdated(!isUpdated) // Rafraîchit les listes liées aux repas et covoiturages
      // Si onUpdate est défini, appelez-le pour notifier PlayerGames
      if (typeof onUpdate === "function") {
        onUpdate()
      }
    } catch (err) {
      console.error(
        "Erreur lors de la suppression des données de l'utilisateur :",
        err
      )
      setError("Impossible de quitter la partie. Veuillez réessayer.")
    }
  }

  const handleOpenCarpoolModal = () => {
    setIsCarpoolModalOpen(true)
  }
  const handleCloseCarpoolModal = () => {
    setIsCarpoolModalOpen(false)
  }
  const handleCarpoolSubmit = (carpoolData) => {
    const authToken = localStorage.getItem("authToken")

    if (!authToken) {
      console.error("Jeton d'authentification manquant !")
      setError("Vous devez être connecté pour ajouter un covoiturage.")
      return
    }

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/covoiturages`,
        {
          utilisateur_id: user.id,
          partie_id: partyId,
          ville_depart: carpoolData.departure,
          ville_arrivee: carpoolData.arrival,
          heure_depart: carpoolData.departureTime,
          propose_retour: carpoolData.returnOffer,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then(() => {
        setIsUpdated(!isUpdated)
      })
      .catch((err) => {
        console.error("Erreur lors de l'ajout du covoiturage :", err)
        setError("Erreur lors de l'ajout du covoiturage.")
      })
  }

  const handleOpenMealModal = () => {
    setIsMealModalOpen(true)
  }
  const handleCloseMealModal = () => {
    setIsMealModalOpen(false)
  }
  const handleMealSubmit = (mealData) => {
    const authToken = localStorage.getItem("authToken")
    if (!authToken) {
      console.error("Jeton d'authentification manquant !")
      setError("Vous devez être connecté pour proposer un repas.")
      return
    }

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/repas`,
        {
          utilisateur_id: user.id,
          partie_id: partyId,
          contenu: mealData.contenu,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then(() => {
        setIsUpdated(!isUpdated)
      })
      .catch((err) => {
        console.error("Erreur lors de l'ajout du repas :", err)
        setError("Erreur lors de l'ajout du repas.")
      })
  }

  // Ouvrir la fiche descriptive d'un utilisateur
  const handleUserClick = (userId) => {
    if (user) {
      setSelectedUser(userId)
    } else {
      console.info("Veuillez vous connecter pour voir le profil.")
    }
  }

  // Fermer la fiche descriptive
  const closeModal = () => setSelectedUser(null)

  // Ouvrir la modale d'édition
  const handleOpenEditModal = () => {
    setIsEditModalOpen(true)
  }

  // Fermer la modale d'édition
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
  }

  // Gérer la soumission du formulaire de modification
  const handleEditSubmit = (updatedGameData) => {
    const authToken = localStorage.getItem("authToken")
    if (!authToken) {
      setError("Vous devez être connecté pour modifier la partie.")
      return
    }

    axios
      .put(
        `${import.meta.env.VITE_BACKEND_URL}/parties/${partyId}`,
        updatedGameData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then(() => {
        setIsUpdated(!isUpdated) // Rafraîchir les détails de la partie
        setIsEditModalOpen(false) // Fermer la modale d'édition
      })
      .catch((err) => {
        console.error("Erreur lors de la modification de la partie :", err)
        setError("Erreur lors de la modification de la partie.")
      })
  }

  const handleDeleteParty = async () => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer cette partie ? Cette action est irréversible."
      )
    ) {
      return // Annule si l'utilisateur ne confirme pas
    }

    try {
      const token = localStorage.getItem("authToken")
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/parties/${partyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      alert("Partie supprimée avec succès.")
      if (typeof onClose === "function") {
        onClose() // Ferme la modale
      }
      if (typeof onUpdate === "function") {
        onUpdate() // Notifie le parent pour rafraîchir la liste des parties
      }
    } catch (err) {
      console.error("Erreur lors de la suppression de la partie :", err)
      setError(
        "Erreur lors de la suppression de la partie. Veuillez réessayer."
      )
    }
  }

  if (loading) return <p>Chargement des détails de la partie...</p>
  if (error) return <p>{error}</p>

  // Mise à jour des conditions pour les boutons
  const canJoin =
    user && user.id !== gameDetails.id_maitre_du_jeu && !isJoined && !isPast
  const canLeave =
    user && user.id !== gameDetails.id_maitre_du_jeu && isJoined && !isPast

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-labelledby="game-title"
      aria-modal="true"
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Fermer la modal"
          >
            ✕
          </button>

          {/* Afficher le bouton Modifier si l'utilisateur est le créateur et que la date n'est pas passée */}
          {isCreator && !isPast && (
            <>
              <button
                className="edit-btn"
                onClick={handleOpenEditModal}
                aria-label="Modifier la partie"
              >
                ✎
              </button>
              <button
                className="delete-btn"
                onClick={handleDeleteParty}
                aria-label="Supprimer la partie"
              >
                🗑️
              </button>
            </>
          )}
        </div>

        <h1 id="game-title" className="game-title">
          {gameDetails.titre}
        </h1>
        <div className="GmEtDescription">
          <div className="game-master-info">
            {gameDetails.maitre_du_jeu_photo && (
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/${
                  gameDetails.maitre_du_jeu_photo
                }`}
                alt={`Maître du jeu ${gameDetails.maitre_du_jeu_pseudo}`}
                className="userPhoto"
                onClick={() => handleUserClick(gameDetails.id_maitre_du_jeu)}
              />
            )}
            <span className="game-master-pseudo">
              MJ: {gameDetails.maitre_du_jeu_pseudo}
            </span>
          </div>

          <div className="game-description">
            <h3>Description :</h3>
            <p>{gameDetails.description}</p>
          </div>
        </div>
        {selectedUser && (
          <UserProfileModal user={selectedUser} onClose={closeModal} />
        )}

        <div className="game-details">
          <div className="game-info-item">
            <img src={iconTime} alt="Icône de l'heure" className="icon2" /> :{" "}
            {gameDetails.date
              ? new Date(gameDetails.date).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }) +
                " à " +
                new Date(gameDetails.date).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Non précisé"}
          </div>
          <div className="game-info-item">
            <img src={iconPlace} alt="Icône du lieu" className="icon2" /> :{" "}
            {gameDetails.lieu || "Lieu non précisé"}
          </div>
          <div className="game-info-item">
            <img src={iconTeam} alt="Icône des joueurs" className="icon2" /> : x{" "}
            {gameDetails.nb_max_joueurs || "Non précisé"}
          </div>
        </div>

        <h3>Participants :</h3>
        <div className="participants-list-box">
          <ParticipantsList
            partyId={partyId}
            isUpdated={isUpdated}
            isCreator={isCreator}
            onParticipantRemoved={refreshData}
          />
        </div>

        {user && (
          <>
            <h3>Autres infos :</h3>
            <CarpoolList
              partyId={partyId}
              isUpdated={isUpdated}
              userId={user?.id}
            />
            <MealList
              partyId={partyId}
              isUpdated={isUpdated}
              userId={user?.id}
            />

            {/* Afficher les icônes uniquement si la date n'est pas passée */}
            {isJoined && !isPast && (
              <>
                <p>
                  Tu souhaites proposer un covoiturage ou informer que tu nous
                  ramènes de quoi manger ou boire ? Parfait ! Clique sur l’icône
                  de ton choix :
                </p>
                <div className="buttonAutresInfos">
                  <img
                    className="icon"
                    src={IconCar}
                    alt="Icône d'une petite voiture rouge"
                    onClick={handleOpenCarpoolModal}
                  />
                  {isCarpoolModalOpen && (
                    <CarpoolModal
                      partyId={partyId}
                      user={user}
                      onClose={handleCloseCarpoolModal}
                      onSubmit={handleCarpoolSubmit}
                    />
                  )}
                  <img
                    className="icon"
                    src={iconPizza}
                    alt="Icône d'une part de pizza"
                    onClick={handleOpenMealModal}
                  />
                  {isMealModalOpen && (
                    <MealModal
                      partyId={partyId}
                      user={user}
                      onClose={handleCloseMealModal}
                      onSubmit={handleMealSubmit}
                    />
                  )}
                </div>
              </>
            )}
          </>
        )}

        {/* Partie est passée -> pas de join/leave possible */}
        {isPast && (
          <p className="past-game-message">
            Cette partie est terminée. Vous ne pouvez plus vous y inscrire ou la
            modifier.
          </p>
        )}

        {/* Sinon, si la date n'est pas passée... */}
        {!isPast && (
          <>
            {/* Si la partie est pleine (strict_nb_joueurs === true et participantsCount >= nb_max_joueurs) */}
            {canJoin && isPartyFull && (
              <p className="full-party-message">
                La partie est victime de son succès, il ne reste plus de place.
              </p>
            )}

            {/* Si on peut rejoindre ET la partie n'est pas pleine */}
            {canJoin && !isPartyFull && (
              <button onClick={handleJoinParty} className="join-btn">
                Rejoindre l'aventure
              </button>
            )}

            {/* Bouton pour quitter la partie, si applicable */}
            {canLeave && (
              <button onClick={handleLeaveParty} className="leave-btn">
                Quitter l'aventure
              </button>
            )}
          </>
        )}

        {/* Modale d'édition */}
        {isEditModalOpen && (
          <GameEditModal
            gameDetails={gameDetails}
            onClose={handleCloseEditModal}
            onSubmit={handleEditSubmit}
          />
        )}
      </div>
    </div>
  )
}

export default GameDetails
