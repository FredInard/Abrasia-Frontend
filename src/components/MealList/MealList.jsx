import React, { useState, useEffect } from "react"
import axios from "axios"
import iconPizza from "../../assets/pics/iconPizza.svg"
import "./MealList.scss"

const MealList = ({ partyId, isUpdated, userId }) => {
  const [meals, setMeals] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/repas/${partyId}`)
      .then((res) => {
        setMeals(Array.isArray(res.data) ? res.data : []) // Assurez-vous que meals est un tableau
        setError(null) // Réinitialise l'erreur si les données sont bien reçues
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des repas :", err)
        setError("Repas non trouvés ou problème avec l'API.")
      })
      .finally(() => {
        setLoading(false) // Arrête le chargement après la réponse de l'API
      })
  }, [partyId, isUpdated])

  // Fonction pour supprimer un repas
  const handleDeleteMeal = (mealId) => {
    const authToken = localStorage.getItem("authToken")

    if (!authToken) {
      console.error("Jeton d'authentification manquant !")
      setError("Vous devez être connecté pour supprimer un repas.")
      return
    }

    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/repas/${mealId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then(() => {
        console.info("Repas supprimé avec succès !")
        setMeals((prevMeals) => prevMeals.filter((meal) => meal.id !== mealId))
      })
      .catch((err) => {
        console.error("Erreur lors de la suppression du repas :", err)
        setError("Erreur lors de la suppression du repas.")
      })
  }

  if (loading) return <p>Chargement des repas...</p>
  if (error) return <p>{error}</p>

  return (
    <div className="MealListBox">
      {/* <h4>Repas</h4> */}
      {meals.length > 0 ? (
        meals.map((meal) => (
          <div key={meal.id} className="MealListInfo">
            <img
              className="iconPizza"
              src={iconPizza}
              alt="icone d'une part de pizza"
            />
            <div>
              {meal.pseudo} Apporte {meal.contenu}
            </div>
            {userId === meal.utilisateur_id && (
              <span
                className="delete-cross"
                onClick={() => handleDeleteMeal(meal.id)}
              >
                ✕
              </span>
            )}
          </div>
        ))
      ) : (
        <p></p>
      )}
    </div>
  )
}

export default MealList
