import { useState, useEffect } from "react";
import axios from "axios";
import "./GameList.scss";
import GameDetails from "../GameDetails/GameDetails";

const GameList = ({ selectedDate }) => {
  const [games, setGames] = useState([]); // Stocke toutes les parties
  const [filteredGames, setFilteredGames] = useState([]); // Parties filtrées par date
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.info("📅 Date sélectionnée :", selectedDate);

  /** 🔹 Récupère les parties depuis l'API */
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const token = localStorage.getItem("authToken");
        console.info("🛂 Auth Token:", token);

        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/parties/affichage`,
          { headers }
        );

        console.info("🎲 Parties reçues :", response.data);

        if (Array.isArray(response.data)) {
          setGames(response.data);
        } else {
          console.warn("⚠️ L'API n'a pas retourné un tableau :", response.data);
          setGames([]);
        }
      } catch (err) {
        console.error("❌ Erreur lors du chargement des parties :", err);
        setError("Impossible de charger les parties. Vérifiez la connexion.");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  /** 🔹 Filtrage des parties selon la date sélectionnée */
  useEffect(() => {
    console.info("🔎 Filtrage des parties pour la date :", selectedDate);

    if (selectedDate && Array.isArray(games)) {
      const formattedDate = selectedDate;
      const filtered = games.filter((game) => {
        if (!game.date) return false; // Évite les erreurs si `date` est undefined
        const gameDate = new Date(game.date).toISOString().split("T")[0];
        return gameDate === formattedDate;
      });

      console.info("🎯 Parties filtrées :", filtered);
      setFilteredGames(filtered);
    } else {
      setFilteredGames([]);
    }
  }, [selectedDate, games]);

  /** 🔹 Ouvre la fenêtre des détails */
  const handleGameClick = (gameId) => {
    console.info("📌 Partie sélectionnée :", gameId);
    setSelectedGameId(gameId);
    setIsModalOpen(true);
  };

  /** 🔹 Ferme la fenêtre des détails */
  const closeModal = () => {
    console.info("❌ Fermeture du modal");
    setIsModalOpen(false);
    setSelectedGameId(null);
  };

  /** 🔹 Formatte la date en `dd-mm-yyyy` */
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [yyyy, mm, dd] = dateString.split("-");
    return `${dd}-${mm}-${yyyy}`;
  };

  // Utilitaire partagé pour formater l'URL d'image

  /** 🔹 Gestion du chargement et des erreurs */
  if (loading) return <p>⏳ Chargement des parties...</p>;
  if (error) return <p>❌ {error}</p>;

  return (
    <>
      <div className="calendarDate">
        {selectedDate ? formatDate(selectedDate) : ""}
      </div>

      <div className="gameBox">
        {selectedDate ? (
          filteredGames.length > 0 ? (
            filteredGames.map((game) => (
              <div key={game.id} className="game-item" onClick={() => handleGameClick(game.id)}>
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
                <p><strong>Lieu :</strong> {game.nb_max_joueurs}</p>
              </div>
            ))
          ) : (
            <p>⚠️ Aucune partie trouvée pour la date sélectionnée.</p>
          )
        ) : (
          <p>🗓️ Veuillez sélectionner une date pour afficher les parties.</p>
        )}

        {isModalOpen && <GameDetails partyId={selectedGameId} onClose={closeModal} />}
      </div>
    </>
  );
};

export default GameList;
