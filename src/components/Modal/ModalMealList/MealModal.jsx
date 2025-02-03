import React, { useState } from "react"
import "./MealModal.scss"

const MealModal = ({ partyId, user, onClose, onSubmit }) => {
  const [mealDescription, setMealDescription] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    console.info(
      "Soumission du formulaire de repas avec description :",
      mealDescription
    )
    onSubmit({
      contenu: mealDescription,
    })
    console.info("Formulaire soumis, fermeture de la modal.")
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <div className="titleModalh2Meal">Apporte de quoi manger</div>
        <form onSubmit={handleSubmit}>
          <label>
            Décris ce que tu apportes :
            <input
              type="text"
              value={mealDescription}
              onChange={(e) => {
                setMealDescription(e.target.value)
                console.info(
                  "Mise à jour de la description du repas :",
                  e.target.value
                )
              }}
              placeholder="Ex: 1 Pizza et 2 Boissons, etc."
              required
            />
          </label>
          <button type="submit">Proposer</button>
        </form>
      </div>
    </div>
  )
}

export default MealModal
