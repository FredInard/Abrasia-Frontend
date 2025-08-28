import React, { useState } from "react"
import "./CarpoolModal.scss"

const CarpoolModal = ({ partyId, user, onClose, onSubmit }) => {
  const [villeDepart, setVilleDepart] = useState("")
  const [villeArrivee, setVilleArrivee] = useState("")
  const [heureDepart, setHeureDepart] = useState("")
  const [proposeRetour, setProposeRetour] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      departure: villeDepart,
      arrival: villeArrivee,
      departureTime: heureDepart,
      returnOffer: proposeRetour,
    })
    onClose()
  }

  return (
    <div
      className="modal-overlayCP"
      onClick={onClose}
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div className="modal-contentCP" onClick={(e) => e.stopPropagation()}>
        <button
          className="close-btnCP"
          onClick={onClose}
          aria-label="Fermer la modale"
        >
          ✕
        </button>
        <h2 className="modal-title" id="modal-title">
          Proposer un covoiturage
        </h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="villeDepart">Lieu de départ :</label>
          <input
            id="villeDepart"
            type="text"
            value={villeDepart}
            onChange={(e) => setVilleDepart(e.target.value)}
            required
          />

          <label htmlFor="villeArrivee">Lieu d'arrivée :</label>
          <input
            id="villeArrivee"
            type="text"
            value={villeArrivee}
            onChange={(e) => setVilleArrivee(e.target.value)}
            required
          />

          <label htmlFor="heureDepart">Heure de départ :</label>
          <input
            id="heureDepart"
            type="datetime-local"
            value={heureDepart}
            onChange={(e) => setHeureDepart(e.target.value)}
            required
          />

          <div className="checkbox-container">
            <input
              id="proposeRetour"
              type="checkbox"
              checked={proposeRetour}
              onChange={(e) => setProposeRetour(e.target.checked)}
            />
            <label htmlFor="proposeRetour">Propose un retour</label>
          </div>

          <button type="submit" className="submit-btn">
            Proposer
          </button>
        </form>
      </div>
    </div>
  )
}

export default CarpoolModal
