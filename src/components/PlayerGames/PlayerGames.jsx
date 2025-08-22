import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { jwtDecode } from "jwt-decode"; // Import pour décoder le token
import GameDetails from "../GameDetails/GameDetails" // Import de GameDetails
import "./PlayerGames.scss"

const PlayerGames = () => {
  const [games, setGames] = useState([])
  const [filteredGames, setFilteredGames] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPartyId, setSelectedPartyId] = useState(null) // État pour le partyId sélectionné

  // États pour les filtres
  const [isMaster, setIsMaster] = useState(false)
  const [showUpcoming, setShowUpcoming] = useState(true)

  let playerId

  try {
    const token = localStorage.getItem("authToken")
    if (token) {
      const decodedToken = jwtDecode(token)
      playerId = decodedToken.id // Récupère l'id de l'utilisateur
    }
  } catch (err) {
    console.error("Erreur lors du décodage du token :", err)
  }

  useEffect(() => {
    const fetchPlayerGames = async () => {
      if (!playerId) {
        setError("Utilisateur non authentifié.")
        setIsLoading(false)
        return
      }

      try {
        const token = localStorage.getItem("authToken")
        const headers = { Authorization: `Bearer ${token}` }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/parties/player/${playerId}`,
          { headers }
        )
        setGames(response.data)
      } catch (err) {
        console.error("Erreur lors du chargement des parties:", err)
        setError("Erreur lors du chargement des parties.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlayerGames()
  }, [playerId])

  const filterGames = useCallback(() => {
    const now = new Date()
    const filtered = games.filter((game) => {
      const isPlayerMaster = game.id_maitre_du_jeu === playerId
      if (isMaster && !isPlayerMaster) return false
      if (!isMaster && isPlayerMaster) return false

      const gameDate = new Date(game.date)
      if (showUpcoming && gameDate < now) return false
      if (!showUpcoming && gameDate >= now) return false

      return true
    })

    setFilteredGames(filtered)
  }, [games, isMaster, showUpcoming, playerId])

  useEffect(() => {
    filterGames()
  }, [filterGames])

  // Gestionnaire de clic pour ouvrir GameDetails
  const handleGameClick = (partyId) => {
    setSelectedPartyId(partyId) // Définit l'ID de la partie sélectionnée
  }

  // Gestionnaire pour fermer GameDetails et revenir à la liste
  const closeGameDetails = () => {
    setSelectedPartyId(null)
  }

  const handleGameUpdate = () => {
    setGames([]) // Réinitialise la liste des jeux
    setIsLoading(true) // Active le rechargement

    // Recharge les parties
    const fetchUpdatedGames = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const headers = { Authorization: `Bearer ${token}` }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/parties/player/${playerId}`,
          { headers }
        )
        setGames(response.data)
      } catch (err) {
        console.error("Erreur lors du rafraîchissement des parties:", err)
        setError("Erreur lors du rafraîchissement des parties.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUpdatedGames()
  }

  if (isLoading) return <p>Chargement des parties...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      {selectedPartyId ? (
        // Affiche GameDetails si un partyId est sélectionné
        <GameDetails
          partyId={selectedPartyId}
          onClose={closeGameDetails}
          onUpdate={handleGameUpdate} // Passe la fonction de mise à jour
        />
      ) : (
        <div>
          <h2>Tes parties :</h2>

          {/* Filtres */}
          <div className="filters">
            <label>
              <input
                type="checkbox"
                checked={isMaster}
                onChange={(e) => setIsMaster(e.target.checked)}
              />
              Maître du jeu uniquement
            </label>
            <label>
              <input
                type="radio"
                name="dateFilter"
                checked={showUpcoming}
                onChange={() => setShowUpcoming(true)}
              />
              À venir
            </label>
            <label>
              <input
                type="radio"
                name="dateFilter"
                checked={!showUpcoming}
                onChange={() => setShowUpcoming(false)}
              />
              Passé
            </label>
          </div>

          {/* Liste des parties filtrées */}
          <div className="game-list">
            {filteredGames.length > 0 ? (
              filteredGames.map((game) => (
                <div
                  key={game.id}
                  className="game-item"
                  onClick={() => handleGameClick(game.id)}
                >
                  <h3>{game.titre}</h3>
                  <img
                    src={
                      game.photo_scenario_url ||
                      `${import.meta.env.VITE_BACKEND_URL}/public/_defaults/dragonBook.webp`
                    }
                    alt={`Illustration de la partie ${game.titre}`}
                    className="illustrationPartie"
                    onError={(e) => {
                      const fallback = `${import.meta.env.VITE_BACKEND_URL}/public/_defaults/dragonBook.webp`
                      if (e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback
                      }
                    }}
                  />
                  <p>
                    <strong>Date :</strong>{" "}
                    {new Date(game.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Rôle :</strong>{" "}
                    {Number(game.id_maitre_du_jeu) === Number(playerId)
                      ? "Maître du jeu"
                      : "Participant"}
                  </p>
                </div>
              ))
            ) : (
              <p>Aucune partie trouvée avec les filtres actuels.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PlayerGames
