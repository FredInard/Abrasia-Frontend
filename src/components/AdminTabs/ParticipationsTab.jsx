// src/components/AdminTabs/ParticipationsTab.jsx

import React, { useState, useEffect } from "react"
import axios from "axios"
import "./ParticipationsTab.scss"

const ParticipationsTab = () => {
  const [participations, setParticipations] = useState([])
  const [filteredParticipations, setFilteredParticipations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedParticipation, setSelectedParticipation] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    utilisateur_id: "",
    partie_id: "",
    // Retiré : date_participation: "",
    // Ajoutez d'autres champs si nécessaire
  })

  // États pour les filtres
  const [filterUtilisateurId, setFilterUtilisateurId] = useState("")
  const [filterPartieId, setFilterPartieId] = useState("")
  // Ajoutez d'autres états de filtres si nécessaire

  const authToken = localStorage.getItem("authToken")

  // Helpers: normalize display fields from various possible API shapes
  const getDisplayPseudo = (p) =>
    p?.utilisateur_pseudo ||
    p?.utilisateur?.pseudo ||
    p?.user?.pseudo ||
    p?.utilisateurPseudo ||
    "Un joueur"

  const getDisplayTitre = (p) =>
    p?.partie_titre ||
    p?.partie?.titre ||
    p?.party?.titre ||
    p?.partieTitre ||
    p?.titre ||
    "Sans titre"

  useEffect(() => {
    console.info("Composant ParticipationsTab monté. Fetch des participations.")
    fetchParticipations()
  }, [])

  const fetchParticipations = () => {
    console.info("Fetching participations from backend.")
    setLoading(true)
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/participations`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        console.info("Participations reçues du backend :", response.data)
        setParticipations(response.data)
        setFilteredParticipations(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des participations :", error)
        setError("Erreur lors du chargement des participations.")
        setLoading(false)
      })
  }

  const applyFilters = () => {
    console.info("Application des filtres:", {
      filterUtilisateurId,
      filterPartieId,
    })
    let filtered = participations

    if (filterUtilisateurId.trim() !== "") {
      filtered = filtered.filter((participation) =>
        (getDisplayPseudo(participation) || "")
          .toLowerCase()
          .includes(filterUtilisateurId.toLowerCase())
      )
      console.info(
        `Filtré par utilisateur_id=${filterUtilisateurId.trim()}:`,
        filtered
      )
    }

    if (filterPartieId.trim() !== "") {
      filtered = filtered.filter((participation) =>
        (getDisplayTitre(participation) || "")
          .toLowerCase()
          .includes(filterPartieId.toLowerCase())
      )
    }

    // Ajoutez d'autres filtres ici si nécessaire

    setFilteredParticipations(filtered)
    console.info("Participations filtrées :", filtered)
  }

  useEffect(() => {
    applyFilters()
  }, [participations, filterUtilisateurId, filterPartieId])

  const handleDelete = (participationId) => {
    console.info(
      `Tentative de suppression de la participation avec ID: ${participationId}`
    )
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette participation ?")
    ) {
      axios
        .delete(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/participations/${participationId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        .then(() => {
          console.info(
            `Participation avec ID ${participationId} supprimée avec succès`
          )
          fetchParticipations()
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la suppression de la participation :",
            error
          )
          setError("Erreur lors de la suppression de la participation.")
        })
    }
  }

  const handleEdit = (participation) => {
    console.info(
      "Mode édition activé pour la participation :",
      participation.id
    )
    setSelectedParticipation(participation)
    setFormData({
      utilisateur_id: participation.utilisateur_id,
      partie_id: participation.partie_id,
      // Retiré : date_participation: participation.date_participation,
      // Ajoutez d'autres champs si nécessaire
    })
    setIsEditing(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.info(
      `Soumission du formulaire. Mode: ${isEditing ? "Édition" : "Création"}`,
      formData
    )
    if (isEditing) {
      // Mettre à jour la participation
      console.info("Envoi de la requête PUT avec les données :", formData)
      axios
        .put(
          `${import.meta.env.VITE_BACKEND_URL}/participations/${
            selectedParticipation.id
          }`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.info("Participation mise à jour avec succès :", response.data)
          setIsEditing(false)
          setSelectedParticipation(null)
          fetchParticipations()
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la mise à jour de la participation :",
            error
          )
          setError("Erreur lors de la mise à jour de la participation.")
        })
    } else if (isCreating) {
      // Créer une nouvelle participation
      console.info("Envoi de la requête POST avec les données :", formData)
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/participations`, formData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.info("Participation créée avec succès :", response.data)
          setIsCreating(false)
          fetchParticipations()
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la création de la participation :",
            error
          )
          setError("Erreur lors de la création de la participation.")
        })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
    console.info(`FormData mis à jour - ${name}:`, value)
  }

  const handleCancel = () => {
    console.info("Formulaire annulé et réinitialisé")
    setIsEditing(false)
    setIsCreating(false)
    setSelectedParticipation(null)
    setFormData({
      utilisateur_id: "",
      partie_id: "",
      // Retiré : date_participation: "",
      // Ajoutez d'autres champs si nécessaire
    })
  }

  if (loading) {
    console.info("Affichage du message de chargement")
    return <p>Chargement des participations...</p>
  }

  if (error) {
    console.error("Affichage de l'erreur :", error)
    return <p>{error}</p>
  }

  return (
    <div className="participations-tab">
      <h2>Gestion des participations</h2>

      {/* Section des filtres */}
      <div className="filters">
        <h3>Filtres</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            applyFilters()
          }}
          className="filters-form"
        >
          <div>
            <label htmlFor="filterUtilisateurId">
              Filtrer par Pseudo Utilisateur :
            </label>
            <input
              type="text"
              id="filterUtilisateurId"
              name="filterUtilisateurId"
              value={filterUtilisateurId}
              onChange={(e) => setFilterUtilisateurId(e.target.value)}
              placeholder="Rechercher par pseudo utilisateur"
            />
          </div>
          <div>
            <label htmlFor="filterPartieId">
              Filtrer par Titre de Partie :
            </label>
            <input
              type="text"
              id="filterPartieId"
              name="filterPartieId"
              value={filterPartieId}
              onChange={(e) => setFilterPartieId(e.target.value)}
              placeholder="Rechercher par titre de partie"
            />
          </div>

          {/* Ajoutez d'autres champs de filtre ici si nécessaire */}
          {/* <button type="button" onClick={handleFilterReset}>
            Réinitialiser les filtres
          </button> */}
        </form>
      </div>

      {isEditing || isCreating ? (
        <form onSubmit={handleSubmit} className="participation-form">
          <div>
            <label htmlFor="utilisateur_id">ID de l'utilisateur :</label>
            <input
              type="number"
              id="utilisateur_id"
              name="utilisateur_id"
              value={formData.utilisateur_id}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="partie_id">ID de la partie :</label>
            <input
              type="number"
              id="partie_id"
              name="partie_id"
              value={formData.partie_id}
              onChange={handleChange}
              required
            />
          </div>
          {/* Retiré : Champ pour la date de participation */}
          {/* Ajoutez d'autres champs si nécessaire */}
          <button type="submit">
            {isEditing
              ? "Mettre à jour la participation"
              : "Ajouter la participation"}
          </button>
          <button type="button" onClick={handleCancel}>
            Annuler
          </button>
        </form>
      ) : (
        <div className="participations-table-container">
          <table className="participations-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Utilisateur (Pseudo)</th>
                <th>Partie (Titre)</th>
                <th>Date de Participation</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredParticipations.length > 0 ? (
                filteredParticipations.map((participation) => (
                  <tr key={participation.id}>
                    <td>{participation.id}</td>
                    <td>{getDisplayPseudo(participation)}</td>
                    {/* Affiche le pseudo */}
                    <td>{getDisplayTitre(participation)}</td>
                    {/* Affiche le titre */}
                    <td>
                      {new Date(
                        participation.date_participation
                      ).toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td>
                      <button onClick={() => handleEdit(participation)}>
                        Modifier
                      </button>
                      <button onClick={() => handleDelete(participation.id)}>
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Aucune participation trouvée.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ParticipationsTab
