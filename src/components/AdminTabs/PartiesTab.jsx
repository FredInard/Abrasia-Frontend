// src/components/AdminTabs/PartiesTab.jsx

import React, { useState, useEffect } from "react"
import axios from "axios"
import "./PartiesTab.scss"

const PartiesTab = () => {
  const [parties, setParties] = useState([])
  const [filteredParties, setFilteredParties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedParty, setSelectedParty] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [formData, setFormData] = useState({
    titre: "",
    type: "jeux",
    description: "",
    date: "",
    nb_max_joueurs: "",
    id_maitre_du_jeu: "",
    duree_estimee: "",
    lieu: "",
    photo_scenario: null, // Utilisation cohérente de 'photo_scenario'
  })
  const [existingPhoto, setExistingPhoto] = useState(null) // Stocker la photo actuelle

  console.info("existingPhoto :", existingPhoto)
  console.info("formData initial :", formData)

  // États pour les filtres
  const [filterTitre, setFilterTitre] = useState("")
  const [filterType, setFilterType] = useState("")
  // const [filterDate, setFilterDate] = useState("")
  const [filterLieu, setFilterLieu] = useState("")
  const [filterIdMj, setFilterIdMj] = useState("")
  const [filterMonth, setFilterMonth] = useState("")
  const [filterYear, setFilterYear] = useState("")

  const authToken = localStorage.getItem("authToken")

  useEffect(() => {
    fetchParties()
  }, [])

  const fetchParties = () => {
    setLoading(true)
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/parties/affichage`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        setParties(response.data)
        setFilteredParties(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des parties :", error)
        setError("Erreur lors du chargement des parties.")
        setLoading(false)
      })
  }

  const applyFilters = () => {
    let filtered = parties

    if (filterTitre.trim() !== "") {
      filtered = filtered.filter((party) =>
        party.titre.toLowerCase().includes(filterTitre.toLowerCase())
      )
    }

    if (filterType !== "") {
      filtered = filtered.filter((party) => party.type === filterType)
    }

    if (filterMonth !== "" || filterYear !== "") {
      filtered = filtered.filter((party) => {
        const partyDate = new Date(party.date)
        const partyMonth = (partyDate.getMonth() + 1)
          .toString()
          .padStart(2, "0") // Mois au format "01" pour janvier
        const partyYear = partyDate.getFullYear().toString()

        const monthMatch = filterMonth === "" || partyMonth === filterMonth
        const yearMatch = filterYear === "" || partyYear === filterYear

        return monthMatch && yearMatch
      })
    }

    if (filterLieu.trim() !== "") {
      filtered = filtered.filter((party) =>
        party.lieu.toLowerCase().includes(filterLieu.toLowerCase())
      )
    }
    if (filterIdMj.trim() !== "") {
      filtered = filtered.filter((party) =>
        party.maitre_du_jeu_pseudo
          .toLowerCase()
          .includes(filterIdMj.toLowerCase())
      )
    }

    setFilteredParties(filtered)
  }

  useEffect(() => {
    applyFilters()
  }, [
    parties,
    filterTitre,
    filterType,
    filterLieu,
    filterIdMj,
    filterMonth,
    filterYear,
  ])

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo_scenario: file, // Utilisation cohérente de 'photo_scenario'
      }))
      console.info("Nouvelle photo sélectionnée :", file)

      // Créer une URL de prévisualisation
      const previewUrl = URL.createObjectURL(file)
      setPhotoPreview(previewUrl)
    }
  }

  const handleEdit = (party) => {
    setSelectedParty(party)
    setFormData({
      titre: party.titre || "",
      type: party.type || "jeux",
      description: party.description || "",
      date: party.date ? new Date(party.date).toISOString().slice(0, 16) : "",
      nb_max_joueurs: party.nb_max_joueurs || "",
      id_maitre_du_jeu: party.id_maitre_du_jeu || "",
      duree_estimee: party.duree_estimee || "",
      lieu: party.lieu || "",
      photo_scenario: null, // Pour remplacer la photo uniquement si une nouvelle est sélectionnée
    })
    setPhotoPreview(
      party.photo_scenario
        ? `${import.meta.env.VITE_BACKEND_URL}/${party.photo_scenario.replace(
            /\\/g,
            "/"
          )}`
        : null
    )
    setExistingPhoto(party.photo_scenario || null)
    setIsEditing(true)
    console.info("Mode édition activé pour la partie :", party.id)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const submitFormData = new FormData()
    Object.keys(formData).forEach((key) => {
      if (key === "photo_scenario") {
        if (formData.photo_scenario) {
          submitFormData.append("photo_scenario", formData.photo_scenario)
        }
      } else {
        submitFormData.append(key, formData[key])
      }
    })

    // Si aucune nouvelle photo, envoyer l'URL existante
    if (!formData.photo_scenario && existingPhoto) {
      submitFormData.append("photo_scenario", existingPhoto)
    }

    // Ajouter un log pour vérifier le contenu de FormData
    console.info("Contenu de FormData avant envoi :")
    for (const pair of submitFormData.entries()) {
      console.info(`${pair[0]}:`, pair[1])
    }

    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        // Ne pas définir 'Content-Type' manuellement pour 'multipart/form-data'
      },
    }

    try {
      if (isEditing) {
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/parties/${selectedParty.id}`,
          submitFormData,
          config
        )
        console.info("Partie mise à jour avec succès :", response.data)
        setIsEditing(false)
        setSelectedParty(null)
        setPhotoPreview(null)
        setExistingPhoto(null)
        fetchParties()
      } else if (isCreating) {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/parties`,
          submitFormData,
          config
        )
        console.info("Partie créée avec succès :", response.data)
        setIsCreating(false)
        setPhotoPreview(null)
        fetchParties()
      }
    } catch (error) {
      console.error("Erreur lors de la soumission de la partie :", error)
      setError("Erreur lors de la soumission de la partie.")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => {
      const updatedFormData = { ...prevData, [name]: value }
      console.info(`FormData mis à jour - ${name}:`, value)
      return updatedFormData
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsCreating(false)
    setSelectedParty(null)
    setPhotoPreview(null)
    setExistingPhoto(null)
    setFormData({
      titre: "",
      type: "jeux",
      description: "",
      date: "",
      nb_max_joueurs: "",
      id_maitre_du_jeu: "",
      duree_estimee: "",
      lieu: "",
      photo_scenario: null,
    })
    console.info("Formulaire annulé et réinitialisé")
  }

  const handleDelete = (partyId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette partie ?")) {
      axios
        .delete(`${import.meta.env.VITE_BACKEND_URL}/parties/${partyId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then(() => {
          console.info(`Partie avec ID ${partyId} supprimée avec succès`)
          fetchParties()
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression de la partie :", error)
          setError("Erreur lors de la suppression de la partie.")
        })
    }
  }

  if (loading) {
    return <p>Chargement des parties...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div className="parties-tab">
      <h2>Gestion des parties</h2>
      {!isEditing && !isCreating && (
        <div className="filters">
          <div>
            <label htmlFor="filterTitre">Filtrer par titre :</label>
            <input
              type="text"
              id="filterTitre"
              value={filterTitre}
              onChange={(e) => setFilterTitre(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="filterType">Filtrer par type :</label>
            <select
              id="filterType"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">Tous</option>
              <option value="jeux">Jeux</option>
              <option value="événement">Événement</option>
              {/* Ajoutez d'autres types si nécessaire */}
            </select>
          </div>
          <div>
            <label htmlFor="filterMonth">Filtrer par mois :</label>
            <select
              id="filterMonth"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            >
              <option value="">Tous</option>
              <option value="01">Janvier</option>
              <option value="02">Février</option>
              <option value="03">Mars</option>
              <option value="04">Avril</option>
              <option value="05">Mai</option>
              <option value="06">Juin</option>
              <option value="07">Juillet</option>
              <option value="08">Août</option>
              <option value="09">Septembre</option>
              <option value="10">Octobre</option>
              <option value="11">Novembre</option>
              <option value="12">Décembre</option>
            </select>
          </div>
          <div>
            <label htmlFor="filterYear">Filtrer par année :</label>
            <select
              id="filterYear"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            >
              <option value="">Toutes</option>
              {Array.from(
                new Set(
                  parties.map((party) => new Date(party.date).getFullYear())
                )
              )
                .sort()
                .map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label htmlFor="filterIdMj">Filtrer par MJ (Pseudo) :</label>
            <input
              type="text"
              id="filterIdMj"
              value={filterIdMj}
              onChange={(e) => setFilterIdMj(e.target.value)}
            />
          </div>
          ;
          <div>
            <label htmlFor="filterLieu">Filtrer par lieu :</label>
            <input
              type="text"
              id="filterLieu"
              value={filterLieu}
              onChange={(e) => setFilterLieu(e.target.value)}
            />
          </div>
        </div>
      )}

      {isEditing || isCreating ? (
        <form onSubmit={handleSubmit} className="party-form">
          <div>
            <label htmlFor="titre">Titre :</label>
            <input
              type="text"
              id="titre"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="type">Type :</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="jeux">Jeux</option>
              <option value="événement">Événement</option>
            </select>
          </div>
          <div>
            <label htmlFor="description">Description :</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="date">Date et heure :</label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="nb_max_joueurs">Nombre maximal de joueurs :</label>
            <input
              type="number"
              id="nb_max_joueurs"
              name="nb_max_joueurs"
              value={formData.nb_max_joueurs}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="id_maitre_du_jeu">ID du maître du jeu :</label>
            <input
              type="number"
              id="id_maitre_du_jeu"
              name="id_maitre_du_jeu"
              value={formData.id_maitre_du_jeu}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="duree_estimee">Durée estimée (en heures) :</label>
            <input
              type="number"
              id="duree_estimee"
              name="duree_estimee"
              value={formData.duree_estimee}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="lieu">Lieu :</label>
            <input
              type="text"
              id="lieu"
              name="lieu"
              value={formData.lieu}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="photo_scenario">Photo du scénario :</label>
            <input
              type="file"
              id="photo_scenario"
              name="photo_scenario"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            {photoPreview ? (
              <div className="photo-preview">
                <p>Aperçu de la photo :</p>
                <img
                  src={photoPreview}
                  alt="Aperçu de la photo"
                  style={{ maxWidth: "200px", marginTop: "10px" }}
                />
              </div>
            ) : (
              isEditing &&
              existingPhoto && (
                <div>
                  <p>Photo actuelle :</p>
                  <img
                    src={`${
                      import.meta.env.VITE_BACKEND_URL
                    }/${existingPhoto.replace(/\\/g, "/")}`}
                    alt="Photo actuelle"
                    style={{ maxWidth: "200px", marginTop: "10px" }}
                  />
                </div>
              )
            )}
          </div>

          <button type="submit">
            {isEditing ? "Mettre à jour la partie" : "Créer la partie"}
          </button>
          <button type="button" onClick={handleCancel}>
            Annuler
          </button>
        </form>
      ) : (
        <div className="parties-table-container">
          <table className="parties-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Photo</th>
                <th>Titre</th>
                <th>Type</th>
                <th>Description</th>
                <th>Date</th>
                <th>Nombre max</th>
                <th>MJ (Pseudo)</th> {/* Indiquez que c'est le pseudo du MJ */}
                <th>Durée</th>
                <th>Lieu</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredParties.map((party) => (
                <tr key={party.id}>
                  <td>{party.id}</td>
                  <td>
                    {party.photo_scenario ? (
                      <img
                        src={`${
                          import.meta.env.VITE_BACKEND_URL
                        }/${party.photo_scenario.replace(/\\/g, "/")}`}
                        alt={party.titre}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <p>Pas de photo</p>
                    )}
                  </td>
                  <td>{party.titre}</td>
                  <td>{party.type}</td>
                  <td>{party.description}</td>
                  <td>
                    {new Date(party.date).toLocaleString("fr-FR", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>{party.nb_max_joueurs}</td>
                  <td>{party.maitre_du_jeu_pseudo}</td>{" "}
                  {/* Remplace id_maitre_du_jeu */}
                  <td>{party.duree_estimee}</td>
                  <td>{party.lieu}</td>
                  <td>
                    <button onClick={() => handleEdit(party)}>Modifier</button>
                    <button onClick={() => handleDelete(party.id)}>
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

export default PartiesTab
