import React, { useState, useEffect } from "react"
import axios from "axios"
import "./NourritureTab.scss"

const NourritureTab = () => {
  const [nourritures, setNourritures] = useState([])
  const [filteredNourritures, setFilteredNourritures] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedNourriture, setSelectedNourriture] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    partie_id: "",
    utilisateur_id: "",
    contenu: "",
  })

  // Filtres
  const [filterPartieId, setFilterPartieId] = useState("")
  const [filterUtilisateurId, setFilterUtilisateurId] = useState("")

  const authToken = localStorage.getItem("authToken")

  useEffect(() => {
    fetchNourritures()
  }, [])

  const fetchNourritures = () => {
    setLoading(true)
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/repas`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        setNourritures(response.data)
        setFilteredNourritures(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des repas :", error)
        setError("Erreur lors du chargement des repas.")
        setLoading(false)
      })
  }

  const applyFilters = () => {
    let filtered = [...nourritures]

    if (filterPartieId.trim() !== "") {
      filtered = filtered.filter(
        (repas) =>
          repas.partie_id.toString().includes(filterPartieId.trim()) ||
          repas.partie_titre
            .toLowerCase()
            .includes(filterPartieId.toLowerCase())
      )
    }

    if (filterUtilisateurId.trim() !== "") {
      filtered = filtered.filter(
        (repas) =>
          repas.utilisateur_id
            .toString()
            .includes(filterUtilisateurId.trim()) ||
          repas.utilisateur_pseudo
            .toLowerCase()
            .includes(filterUtilisateurId.toLowerCase())
      )
    }

    setFilteredNourritures(filtered)
  }

  useEffect(() => {
    applyFilters()
  }, [nourritures, filterPartieId, filterUtilisateurId])

  const handleDelete = (nourritureId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce repas ?")) {
      axios
        .delete(`${import.meta.env.VITE_BACKEND_URL}/repas/${nourritureId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then(() => {
          fetchNourritures()
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression du repas :", error)
          setError("Erreur lors de la suppression du repas.")
        })
    }
  }

  const handleEdit = (nourriture) => {
    setSelectedNourriture(nourriture)
    setFormData({
      partie_id: nourriture.partie_id,
      utilisateur_id: nourriture.utilisateur_id,
      contenu: nourriture.contenu,
    })
    setIsEditing(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isEditing) {
      // Mettre à jour le repas
      axios
        .put(
          `${import.meta.env.VITE_BACKEND_URL}/repas/${selectedNourriture.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        .then(() => {
          setIsEditing(false)
          setSelectedNourriture(null)
          fetchNourritures()
        })
        .catch((error) => {
          console.error("Erreur lors de la mise à jour du repas :", error)
          setError("Erreur lors de la mise à jour du repas.")
        })
    } else if (isCreating) {
      // Créer un nouveau repas
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/repas`, formData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then(() => {
          setIsCreating(false)
          fetchNourritures()
        })
        .catch((error) => {
          console.error("Erreur lors de la création du repas :", error)
          setError("Erreur lors de la création du repas.")
        })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsCreating(false)
    setSelectedNourriture(null)
    setFormData({
      partie_id: "",
      utilisateur_id: "",
      contenu: "",
    })
  }

  if (loading) {
    return <p>Chargement des repas...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div className="nourriture-tab">
      <h2>Gestion des repas</h2>
      <div className="filters">
        <div>
          <label htmlFor="filterPartieId">
            Filtrer par Partie ID ou Titre :
          </label>
          <input
            type="text"
            id="filterPartieId"
            value={filterPartieId}
            onChange={(e) => setFilterPartieId(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="filterUtilisateurId">
            Filtrer par Utilisateur ID ou Pseudo :
          </label>
          <input
            type="text"
            id="filterUtilisateurId"
            value={filterUtilisateurId}
            onChange={(e) => setFilterUtilisateurId(e.target.value)}
          />
        </div>
      </div>
      {isEditing || isCreating ? (
        <form onSubmit={handleSubmit} className="nourriture-form">
          <div>
            <label htmlFor="partie_id">Partie :</label>
            <input
              type="number"
              id="partie_id"
              name="partie_id"
              value={formData.partie_id}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="utilisateur_id">Utilisateur :</label>
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
            <label htmlFor="contenu">Contenu :</label>
            <textarea
              id="contenu"
              name="contenu"
              value={formData.contenu}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">
            {isEditing ? "Mettre à jour le repas" : "Ajouter le repas"}
          </button>
          <button type="button" onClick={handleCancel}>
            Annuler
          </button>
        </form>
      ) : (
        <div className="nourriture-table-container">
          <table className="nourriture-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Partie (Titre & ID)</th>
                <th>Utilisateur (Pseudo & ID)</th>
                <th>Contenu</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredNourritures.map((nourriture) => (
                <tr key={nourriture.id}>
                  <td>{nourriture.id}</td>
                  <td>
                    {nourriture.partie_titre} (ID: {nourriture.partie_id})
                  </td>
                  <td>
                    {nourriture.utilisateur_pseudo} (ID:{" "}
                    {nourriture.utilisateur_id})
                  </td>
                  <td>{nourriture.contenu}</td>
                  <td>
                    <button onClick={() => handleEdit(nourriture)}>
                      Modifier
                    </button>
                    <button onClick={() => handleDelete(nourriture.id)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default NourritureTab
