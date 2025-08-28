import { useState } from "react"
import PropTypes from "prop-types"
import "./GameEditModal.scss"

const GameEditModal = ({ gameDetails, onClose, onSubmit }) => {
  // Initialiser formData avec tous les détails de gameDetails
  // On convertit `strict_nb_joueurs` en chaîne "1"/"0" pour la case à cocher
  const [formData, setFormData] = useState(() => {
    return {
      ...gameDetails,
      date: gameDetails.date
        ? new Date(gameDetails.date).toISOString().slice(0, 16)
        : "",
      // Si strict_nb_joueurs vaut 1 / true, on met "1", sinon "0".
      strict_nb_joueurs: gameDetails.strict_nb_joueurs ? "1" : "0",
    }
  })

  // Pour prévisualiser la photo téléchargée
  // et normaliser l'URL
  const normalizeUrl = (url) => url.replace(/([^:]\/)\/+/g, "$1")
  const [photoPreview, setPhotoPreview] = useState(() => {
    if (gameDetails.photo_scenario_url) {
      return gameDetails.photo_scenario_url
    }
    return null
  })

  // Gère les changements dans les inputs texte, number, textarea, etc.
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  // Gère le changement de fichier (image)
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        photo_scenario: file, // Stocker le fichier pour l'envoi
      }))
      setPhotoPreview(URL.createObjectURL(file)) // Prévisualisation
    }
  }

  // Gère la case à cocher pour strict_nb_joueurs
  const handleStrictChange = (e) => {
    // e.target.checked est un booléen
    // On le convertit en "1" ou "0"
    const checkedValue = e.target.checked ? "1" : "0"
    setFormData((prevData) => ({
      ...prevData,
      strict_nb_joueurs: checkedValue,
    }))
  }

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault()

    const updatedFormData = new FormData()
    // Ajouter les champs au FormData
    Object.keys(formData).forEach((key) => {
      // Si c'est un fichier, on le traite différemment
      if (key === "photo_scenario" && formData[key] instanceof File) {
        updatedFormData.append(key, formData[key])
      } else {
        updatedFormData.append(key, formData[key])
      }
    })

    onSubmit(updatedFormData) // Envoyer les données au parent (handleEditSubmit)
  }

  return (
    <div className="edit-modal-overlay" onClick={onClose}>
      <div
        className="edit-modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Fermer la modal"
        >
          ✕
        </button>
        <h2>Modifier la partie</h2>
        <form onSubmit={handleSubmit} className="edit-form">
          {/* Titre */}
          <div className="form-group">
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

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description :</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Date et heure */}
          <div className="form-group">
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

          {/* Lieu */}
          <div className="form-group">
            <label htmlFor="lieu">Lieu :</label>
            <input
              type="text"
              id="lieu"
              name="lieu"
              value={formData.lieu || ""}
              onChange={handleChange}
            />
          </div>

          {/* Nombre max joueurs */}
          <div className="form-group">
            <label htmlFor="nb_max_joueurs">Nombre maximal de joueurs :</label>
            <input
              type="number"
              id="nb_max_joueurs"
              name="nb_max_joueurs"
              value={formData.nb_max_joueurs}
              onChange={handleChange}
            />
          </div>

          {/* Case à cocher pour strict_nb_joueurs */}
          <div className="form-group checkbox-group">
            <label htmlFor="strict_nb_joueurs">
              Limiter strictement au nombre maximal ?
            </label>
            <input
              type="checkbox"
              id="strict_nb_joueurs"
              name="strict_nb_joueurs"
              checked={formData.strict_nb_joueurs === "1"}
              onChange={handleStrictChange}
            />
          </div>

          {/* Durée estimée */}
          <div className="form-group">
            <label htmlFor="duree_estimee">Durée estimée (en heures) :</label>
            <input
              type="number"
              id="duree_estimee"
              name="duree_estimee"
              value={formData.duree_estimee}
              onChange={handleChange}
            />
          </div>

          {/* Photo du scénario */}
          <div className="form-group">
            <label htmlFor="photo_scenario">Photo du scénario :</label>
            {photoPreview && (
              <img
                src={normalizeUrl(photoPreview)}
                alt="Prévisualisation"
                className="photo-preview"
              />
            )}
            <input
              type="file"
              id="photo_scenario"
              name="photo_scenario"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <button type="submit" className="submit-btn">
            Enregistrer les modifications
          </button>
        </form>
      </div>
    </div>
  )
}

GameEditModal.propTypes = {
  gameDetails: PropTypes.shape({
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    strict_nb_joueurs: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number,
      PropTypes.string,
    ]),
    photo_scenario_url: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default GameEditModal
