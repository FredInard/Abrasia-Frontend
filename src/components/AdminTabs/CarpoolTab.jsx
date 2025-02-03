// src/components/AdminTabs/CarpoolTab.jsx

import React, { useState, useEffect } from "react"
import axios from "axios"
import "./CarpoolTab.scss"

const CarpoolTab = () => {
  const [carpools, setCarpools] = useState([])
  const [filteredCarpools, setFilteredCarpools] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCarpool, setSelectedCarpool] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    utilisateur_id: "",
    partie_id: "",
    ville_depart: "",
    ville_arrivee: "",
    heure_depart: "",
    propose_retour: false,
  })

  const [filterUtilisateurId, setFilterUtilisateurId] = useState("")
  const [filterPartieId, setFilterPartieId] = useState("")
  const [filterVilleDepart, setFilterVilleDepart] = useState("")
  const [filterVilleArrivee, setFilterVilleArrivee] = useState("")
  const [filterDate, setFilterDate] = useState("")

  const authToken = localStorage.getItem("authToken")

  useEffect(() => {
    fetchCarpools()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [
    carpools,
    filterUtilisateurId,
    filterPartieId,
    filterVilleDepart,
    filterVilleArrivee,
    filterDate,
  ])

  const fetchCarpools = () => {
    setLoading(true)
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/covoiturages`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        setCarpools(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des covoiturages :", error)
        setError("Erreur lors du chargement des covoiturages.")
        setLoading(false)
      })
  }

  const applyFilters = () => {
    let filtered = carpools

    // Filtrer par pseudo utilisateur
    if (filterUtilisateurId.trim() !== "") {
      filtered = filtered.filter((carpool) =>
        carpool.utilisateur_pseudo
          .toLowerCase()
          .includes(filterUtilisateurId.trim().toLowerCase())
      )
    }

    // Filtrer par titre de partie
    if (filterPartieId.trim() !== "") {
      filtered = filtered.filter((carpool) =>
        carpool.partie_titre
          .toLowerCase()
          .includes(filterPartieId.trim().toLowerCase())
      )
    }

    if (filterVilleDepart.trim() !== "") {
      filtered = filtered.filter((carpool) =>
        carpool.ville_depart
          .toLowerCase()
          .includes(filterVilleDepart.toLowerCase())
      )
    }

    if (filterVilleArrivee.trim() !== "") {
      filtered = filtered.filter((carpool) =>
        carpool.ville_arrivee
          .toLowerCase()
          .includes(filterVilleArrivee.toLowerCase())
      )
    }

    if (filterDate !== "") {
      filtered = filtered.filter((carpool) => {
        const carpoolDate = new Date(carpool.heure_depart)
          .toISOString()
          .slice(0, 10)
        return carpoolDate === filterDate
      })
    }

    setFilteredCarpools(filtered)
  }

  const handleDelete = (carpoolId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce covoiturage ?")) {
      axios
        .delete(
          `${import.meta.env.VITE_BACKEND_URL}/covoiturages/${carpoolId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        .then(() => {
          fetchCarpools()
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression du covoiturage :", error)
          setError("Erreur lors de la suppression du covoiturage.")
        })
    }
  }

  const handleEdit = (carpool) => {
    setSelectedCarpool(carpool)
    setFormData({
      utilisateur_id: carpool.utilisateur_id,
      partie_id: carpool.partie_id,
      ville_depart: carpool.ville_depart,
      ville_arrivee: carpool.ville_arrivee,
      heure_depart: carpool.heure_depart
        ? new Date(carpool.heure_depart).toISOString().slice(0, 16)
        : "",
      propose_retour: carpool.propose_retour,
    })
    setIsEditing(true)
  }

  // const handleCreate = () => {
  //   setFormData({
  //     utilisateur_id: "",
  //     partie_id: "",
  //     ville_depart: "",
  //     ville_arrivee: "",
  //     heure_depart: "",
  //     propose_retour: false,
  //   })
  //   setIsCreating(true)
  // }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isEditing) {
      axios
        .put(
          `${import.meta.env.VITE_BACKEND_URL}/covoiturages/${
            selectedCarpool.id
          }`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        .then(() => {
          setIsEditing(false)
          setSelectedCarpool(null)
          fetchCarpools()
        })
        .catch((error) => {
          console.error("Erreur lors de la mise à jour du covoiturage :", error)
          setError("Erreur lors de la mise à jour du covoiturage.")
        })
    } else if (isCreating) {
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/covoiturages`, formData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then(() => {
          setIsCreating(false)
          fetchCarpools()
        })
        .catch((error) => {
          console.error("Erreur lors de la création du covoiturage :", error)
          setError("Erreur lors de la création du covoiturage.")
        })
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsCreating(false)
    setSelectedCarpool(null)
    setFormData({
      utilisateur_id: "",
      partie_id: "",
      ville_depart: "",
      ville_arrivee: "",
      heure_depart: "",
      propose_retour: false,
    })
  }

  if (loading) {
    return <p>Chargement des covoiturages...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div className="carpool-tab">
      <h2>Gestion des covoiturages</h2>
      {/* <button onClick={handleCreate}>Ajouter un covoiturage</button> */}
      {!isEditing && !isCreating && (
        <div className="filters">
          <div>
            <label htmlFor="filterUtilisateurPseudo">
              Filtrer par pseudo utilisateur :
            </label>
            <input
              type="text"
              id="filterUtilisateurPseudo"
              value={filterUtilisateurId} // Peut être renommé en `filterUtilisateurPseudo`
              onChange={(e) => setFilterUtilisateurId(e.target.value)} // Renommez si nécessaire
              placeholder="Rechercher par pseudo"
            />
          </div>
          <div>
            <label htmlFor="filterPartieTitre">
              Filtrer par titre de partie :
            </label>
            <input
              type="text"
              id="filterPartieTitre"
              value={filterPartieId} // Peut être renommé en `filterPartieTitre`
              onChange={(e) => setFilterPartieId(e.target.value)} // Renommez si nécessaire
              placeholder="Rechercher par titre"
            />
          </div>

          <div>
            <label htmlFor="filterVilleDepart">
              Filtrer par ville de départ :
            </label>
            <input
              type="text"
              id="filterVilleDepart"
              value={filterVilleDepart}
              onChange={(e) => setFilterVilleDepart(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="filterVilleArrivee">
              Filtrer par ville d'arrivée :
            </label>
            <input
              type="text"
              id="filterVilleArrivee"
              value={filterVilleArrivee}
              onChange={(e) => setFilterVilleArrivee(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="filterDate">Filtrer par date :</label>
            <input
              type="date"
              id="filterDate"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>
      )}
      {isEditing || isCreating ? (
        <form onSubmit={handleSubmit} className="carpool-form">
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
            <label htmlFor="ville_depart">Ville de départ :</label>
            <input
              type="text"
              id="ville_depart"
              name="ville_depart"
              value={formData.ville_depart}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="ville_arrivee">Ville d'arrivée :</label>
            <input
              type="text"
              id="ville_arrivee"
              name="ville_arrivee"
              value={formData.ville_arrivee}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="heure_depart">Heure de départ :</label>
            <input
              type="datetime-local"
              id="heure_depart"
              name="heure_depart"
              value={formData.heure_depart}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="propose_retour">
              <input
                type="checkbox"
                id="propose_retour"
                name="propose_retour"
                checked={formData.propose_retour}
                onChange={handleChange}
              />
              Propose un retour
            </label>
          </div>
          <button type="submit">
            {isEditing
              ? "Mettre à jour le covoiturage"
              : "Ajouter le covoiturage"}
          </button>
          <button type="button" onClick={handleCancel}>
            Annuler
          </button>
        </form>
      ) : (
        <table className="carpool-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Utilisateur</th>
              <th>Partie</th>
              <th>Départ</th>
              <th>Arrivée</th>
              <th>Heure de départ</th>
              <th>Retour</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCarpools.map((carpool) => (
              <tr key={carpool.covoiturage_id}>
                <td>{carpool.covoiturage_id}</td>
                <td>{carpool.utilisateur_pseudo || "Inconnu"}</td>
                <td>{carpool.partie_titre || "Titre indisponible"}</td>
                <td>{carpool.ville_depart}</td>
                <td>{carpool.ville_arrivee}</td>
                <td>
                  {new Date(carpool.heure_depart).toLocaleString("fr-FR", {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td>{carpool.propose_retour ? "Oui" : "Non"}</td>
                <td>
                  <button onClick={() => handleEdit(carpool)}>Modifier</button>
                  <button onClick={() => handleDelete(carpool.covoiturage_id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default CarpoolTab
