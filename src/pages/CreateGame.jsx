import React, { useState } from "react"
import axios from "axios"
import "./CreateGame.scss"
import NavBar from "../components/NavBar/NavBar"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { jwtDecode } from "jwt-decode";

const CreateGame = () => {
  const navigate = useNavigate()

  const [titre, setTitre] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [nbMaxJoueurs, setNbMaxJoueurs] = useState(4)
  const [lieu, setLieu] = useState("ECE Malijai")
  const [dureeEstimee, setDureeEstimee] = useState("")
  const [photoScenario, setPhotoScenario] = useState(null)
  const [type, setType] = useState("jeux")

  // Nouveau state pour la case à cocher (limiter les participants)
  const [strictNbJoueurs, setStrictNbJoueurs] = useState(false)

  const token = localStorage.getItem("authToken")
  let idMaitreDuJeu = null

  if (token) {
    try {
      const decodedToken = jwtDecode(token)
      idMaitreDuJeu = decodedToken.id
    } catch (error) {
      toast.error("Erreur d'authentification. Veuillez vous reconnecter.")
      navigate("/login")
      return null
    }
  } else {
    toast.error("Vous devez être connecté pour créer une partie.")
    navigate("/login")
    return null
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!titre || !description || !date || !lieu || !dureeEstimee) {
      toast.error("Veuillez remplir tous les champs requis.")
      return
    }

    const formData = new FormData()
    formData.append("titre", titre)
    formData.append("description", description)

    const formattedDate = new Date(date)
      .toISOString()
      .replace("T", " ")
      .slice(0, 19)
    formData.append("date", formattedDate)
    formData.append("nb_max_joueurs", parseInt(nbMaxJoueurs, 10))
    formData.append("lieu", lieu)
    formData.append("duree_estimee", parseInt(dureeEstimee, 10))
    formData.append("type", type)
    formData.append("id_maitre_du_jeu", idMaitreDuJeu)

    // === Nouveauté : on ajoute strict_nb_joueurs ===
    // (Pour MySQL, ce sera un TINYINT(1), donc on peut envoyer "1" ou "0".)
    formData.append("strict_nb_joueurs", strictNbJoueurs ? "1" : "0")

    if (photoScenario) {
      formData.append("photo_scenario", photoScenario)
    }

    const loadingToast = toast.loading("Création de la partie en cours...")

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/parties`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.status === 201) {
        toast.update(loadingToast, {
          render: "La partie a été créée avec succès !",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        })

        // Réinitialisation des champs
        setTitre("")
        setDescription("")
        setDate("")
        setNbMaxJoueurs(4)
        setLieu("ECE Malijai")
        setDureeEstimee("")
        setPhotoScenario(null)
        setType("jeux")
        setStrictNbJoueurs(false)

        setTimeout(() => {
          navigate("/parties")
        }, 3000)
      } else {
        toast.update(loadingToast, {
          render: "Erreur lors de la création de la partie.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        })
      }
    } catch (error) {
      toast.update(loadingToast, {
        render: "Une erreur est survenue lors de la création de la partie.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      })
      console.error("Erreur lors de la création de la partie :", error)
    }
  }

  const handleFileChange = (e) => {
    setPhotoScenario(e.target.files[0])
  }

  return (
    <>
      <NavBar />
      <div className="creer-partie-container">
        <h1>Créer une nouvelle partie</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group">
            <label className="labelCreateGame" htmlFor="titre">
              Titre de la partie
            </label>
            <input
              type="text"
              id="titre"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="labelCreateGame" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="jeux">Jeux</option>
              <option value="événement">Événement</option>
            </select>
          </div>
          <div className="form-group">
            <label className="labelCreateGame" htmlFor="date">
              Date de la partie
            </label>
            <input
              type="datetime-local"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="labelCreateGame" htmlFor="nbMaxJoueurs">
              Nombre maximum de joueurs
            </label>
            <input
              type="number"
              id="nbMaxJoueurs"
              value={nbMaxJoueurs}
              min="1"
              onChange={(e) => setNbMaxJoueurs(e.target.value)}
              required
            />
          </div>

          {/* Toggle Oui/Non pour la limitation stricte */}
          <div className="form-group">
            <label className="labelCreateGame" htmlFor="strict_nb_joueurs">
              Limiter les participants ?
            </label>
            <div className="toggle-switch">
              <input
                type="checkbox"
                id="strict_nb_joueurs"
                className="toggle-input"
                checked={strictNbJoueurs}
                onChange={() => setStrictNbJoueurs(!strictNbJoueurs)}
              />
              <label className="toggle-label" htmlFor="strict_nb_joueurs">
                <span className="toggle-inner"></span>
                <span className="toggle-switch-handle"></span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="labelCreateGame" htmlFor="lieu">
              Lieu
            </label>
            <input
              type="text"
              id="lieu"
              value={lieu}
              onChange={(e) => setLieu(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="labelCreateGame" htmlFor="dureeEstimee">
              Durée estimée (en heures)
            </label>
            <input
              type="number"
              id="dureeEstimee"
              value={dureeEstimee}
              min="1"
              onChange={(e) => setDureeEstimee(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="labelCreateGame" htmlFor="photoScenario">
              Photo du scénario
            </label>
            <input
              type="file"
              id="photoScenario"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <button type="submit" className="btn-submit">
            Créer la partie
          </button>
        </form>
      </div>
    </>
  )
}

export default CreateGame
