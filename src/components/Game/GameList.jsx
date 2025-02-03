import React, { useState, useEffect } from "react"
import axios from "axios"
import "./GameList.scss"
import GameDetails from "../GameDetails/GameDetails"

const GameList = ({ selectedDate }) => {
  const [games, setGames] = useState([])
  const [filteredGames, setFilteredGames] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedGameId, setSelectedGameId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  console.info("games", games)
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const token = localStorage.getItem("authToken")
        console.info("GameList authToken:", token)
        const headers = { Authorization: `Bearer ${token}` }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/parties/affichage`,
          { headers }
        )

        console.info("Games fetched:", response.data)
        setGames(response.data)
      } catch (err) {
        console.error("Erreur lors du chargement des parties :", err)
        setError(
          "Impossible de charger les parties. Veuillez vérifier la connexion réseau."
        )
      } finally {
        setLoading(false)
        console.info("Loading set to false")
      }
    }

    fetchGames()
  }, [])

  useEffect(() => {
    console.info("Selected date:", selectedDate)
    console.info("Games before filtering:", games)

    if (selectedDate) {
      const formattedSelectedDate = selectedDate

      const filtered = games.filter((game) => {
        const gameDate = new Date(game.date).toISOString().split("T")[0]
        return gameDate === formattedSelectedDate
      })

      console.info("Filtered games:", filtered)
      setFilteredGames(filtered)
    } else {
      setFilteredGames([])
    }
  }, [selectedDate, games])

  const handleGameClick = (gameId) => {
    console.info("Game clicked with ID:", gameId)
    setSelectedGameId(gameId)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    console.info("Closing modal")
    setIsModalOpen(false)
    setSelectedGameId(null)
  }

  if (loading) {
    return <p>Chargement des parties...</p>
  }
  if (error) {
    return <p>{error}</p>
  }
  function formatDate(dateString) {
    // dateString = "2025-01-17"
    const [yyyy, mm, dd] = dateString.split("-")
    // dd = "17", mm = "01", yyyy = "2025"
    return `${dd}-${mm}-${yyyy}` // ex. "17-01-2025"
  }
  return (
    <>
      <div className="calendarDate">
        {selectedDate ? formatDate(selectedDate) : ""}
      </div>
      <div className="gameBox">
        {selectedDate ? (
          filteredGames.length > 0 ? (
            filteredGames.map((game) => {
              return (
                <div
                  key={game.id}
                  className="game-item"
                  onClick={() => handleGameClick(game.id)}
                >
                  <h3>{game.titre}</h3>
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL.replace(
                      /\/$/,
                      ""
                    )}/${game.photo_scenario.replace(/\\/g, "/")}`}
                    alt="illustration de la partie"
                    className="illustrationPartie"
                  />

                  <p>
                    <strong>Lieu :</strong> {game.nb_max_joueurs}
                  </p>
                </div>
              )
            })
          ) : (
            <p>Aucune partie trouvée pour la date sélectionnée.</p>
          )
        ) : (
          <p>Veuillez sélectionner une date pour afficher les parties.</p>
        )}
        {isModalOpen && (
          <GameDetails partyId={selectedGameId} onClose={closeModal} />
        )}
      </div>
    </>
  )
}

export default GameList
