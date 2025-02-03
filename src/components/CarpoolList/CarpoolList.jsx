import React, { useState, useEffect } from "react"
import axios from "axios"

import "./CarpoolList.scss"
import IconCar from "../../assets/pics/iconCar.svg"

const CarpoolList = ({ partyId, userId, isUpdated }) => {
  const [carpools, setCarpools] = useState([])
  const [error, setError] = useState(null) // Ajout d'un état pour l'erreur
  console.info("User ID dans CarpoolList:", userId)

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/covoiturages/${partyId}`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCarpools(res.data) // Si res.data est bien un tableau
        } else {
          console.warn("Format inattendu des données :", res.data)
          setCarpools([res.data]) // Si res.data n'est pas un tableau, le transformer en tableau
        }
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des covoiturages :", err)
        setError("Impossible de charger les covoiturages.")
      })
  }, [partyId, isUpdated])

  if (error) return <p>{error}</p>

  // Fonction pour supprimer un covoiturage
  const handleDeleteCarpool = (carpoolId) => {
    const authToken = localStorage.getItem("authToken")
    if (!authToken) return

    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/covoiturages/${carpoolId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then(() => {
        console.info("Covoiturage supprimé avec succès !")
        setCarpools(carpools.filter((carpool) => carpool.id !== carpoolId))
      })
      .catch((err) => console.error("Erreur lors de la suppression :", err))
  }

  return (
    <div>
      {/* <h4>Covoiturages</h4> */}
      {Array.isArray(carpools) && carpools.length > 0 ? (
        carpools.map((carpool) => (
          <div key={carpool.id}>
            <p>
              <div className="carpoolListBox">
                <img
                  className="iconCar"
                  src={IconCar}
                  alt="icone d'une petite voiture rouge"
                />
                {carpool.pseudo} propose un covoiturage de{" "}
                {carpool.ville_depart} à {carpool.ville_arrivee} - départ{" "}
                {new Date(carpool.heure_depart).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {carpool.utilisateur_id === userId && (
                  <button
                    onClick={() => handleDeleteCarpool(carpool.id)}
                    className="delete-btn"
                  >
                    ✕
                  </button>
                )}
              </div>
            </p>
          </div>
        ))
      ) : (
        <p></p>
      )}
    </div>
  )
}

export default CarpoolList
