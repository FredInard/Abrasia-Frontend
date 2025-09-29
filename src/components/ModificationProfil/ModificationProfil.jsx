import { useState, useEffect } from "react"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { jwtDecode } from "jwt-decode";
import ChangePassword from "./ChangePassword.jsx"
import "./ModificationProfil.scss"
import LogoutButton from "../../components/Logout/LogoutButton.jsx"

export default function ModificationProfil() {
  const [utilisateur, setUtilisateur] = useState({})
  const [existingPhotoUrl, setExistingPhotoUrl] = useState(null)
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    role: "", // Le rôle est inclus ici
    pseudo: "",
    date_naissance: "",
    adresse: "",
    ville: "",
    telephone: "",
    bio: "",
    photo_profil: "",
  })
  const [imageUrl, setImageUrl] = useState(null)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)

  console.info("formData :", formData)

  // Récupérer le token depuis le localStorage
  const token = localStorage.getItem("authToken")
  console.info("Token récupéré :", token)

  let idUser = null

  if (token && token.trim() !== "") {
    try {
      const decodedToken = jwtDecode(token)
      idUser = decodedToken.id // Assurez-vous que l'ID est bien sous la clé 'id'
      console.info("idUser", idUser)
    } catch (error) {
      console.error("Erreur lors du décodage du token :", error)
      // Gérer le cas où le token est invalide
      // Par exemple, rediriger vers la page de connexion
    }
  } else {
    console.error(
      "Aucun token valide trouvé. L'utilisateur n'est pas authentifié."
    )
    // Rediriger vers la page de connexion ou afficher un message d'erreur
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  }

  // Charger les données utilisateur depuis le backend
  useEffect(() => {
    if (idUser) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/utilisateurs/${idUser}`, {
          headers,
        })
        .then((res) => {
          setUtilisateur(res.data)
          setFormData({
            nom: res.data.nom || "",
            prenom: res.data.prenom || "",
            email: res.data.email || "",
            role: res.data.role, // Récupérer le rôle tel quel
            pseudo: res.data.pseudo || "",
            date_naissance: res.data.date_naissance
              ? res.data.date_naissance.slice(0, 10)
              : "",
            adresse: res.data.adresse || "",
            ville: res.data.ville || "",
            telephone: res.data.telephone || "",
            bio: res.data.bio || "",
            photo_profil: res.data.photo_profil || "",
          })
          console.info("setFormData :", formData)

          if (res.data.photo_url) {
            setImageUrl(res.data.photo_url)
          }
        })
        .catch((err) => {
          console.error("Problème lors du chargement de l'utilisateur", err)
        })
    } else {
      console.error(
        "ID utilisateur non disponible. Impossible de charger les données utilisateur."
      )
      // Gérer le cas où l'ID utilisateur n'est pas disponible
    }
  }, [idUser])

  // Mettre à jour l'image quand l'utilisateur change
  useEffect(() => {
    if (utilisateur.photo_url) {
      setImageUrl(utilisateur.photo_url)
    }
  }, [utilisateur.photo_url])

  // Gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  useEffect(() => {
    if (idUser) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/utilisateurs/${idUser}`, {
          headers,
        })
        .then((res) => {
          setUtilisateur(res.data)
          setFormData({
            nom: res.data.nom || "",
            prenom: res.data.prenom || "",
            email: res.data.email || "",
            role: res.data.role, // Récupérer le rôle tel quel
            pseudo: res.data.pseudo || "",
            date_naissance: res.data.date_naissance
              ? res.data.date_naissance.slice(0, 10)
              : "",
            adresse: res.data.adresse || "",
            ville: res.data.ville || "",
            telephone: res.data.telephone || "",
            bio: res.data.bio || "",
            photo_profil: res.data.photo_profil || "",
          })
          console.info("setFormData :", formData)

          if (res.data.photo_url) {
            setExistingPhotoUrl(res.data.photo_url)
          }
        })
        .catch((err) => {
          console.error("Problème lors du chargement de l'utilisateur", err)
        })
    } else {
      console.error(
        "ID utilisateur non disponible. Impossible de charger les données utilisateur."
      )
      // Gérer le cas où l'ID utilisateur n'est pas disponible
    }
  }, [idUser])

  // Gérer l'upload de la photo de profil
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormData((prevData) => ({
      ...prevData,
      photo_profil: file,
    }))
    setImageUrl(URL.createObjectURL(file))
  }

  // Fonction de soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault()

    const formDataToSend = new FormData()

    // Créer une copie de formData pour manipulation
    const formDataCopy = { ...formData }

    // Normaliser l'email: trim + lowercase si présent
    if (typeof formDataCopy.email === "string") {
      formDataCopy.email = formDataCopy.email.trim().toLowerCase()
    }

    // Formater la date en ISO minuit UTC si présente (YYYY-MM-DDT00:00:00.000Z)
    if (formDataCopy.date_naissance) {
      const d = String(formDataCopy.date_naissance).slice(0, 10)
      formDataCopy.date_naissance = `${d}T00:00:00.000Z`
    }

    // Ajouter les champs au FormData
    Object.keys(formDataCopy).forEach((key) => {
      // Ne pas envoyer 'role' depuis ce formulaire
      if (key === "role") return

      // Gérer la photo: n'envoyer que s'il s'agit d'un vrai fichier
      if (key === "photo_profil") {
        if (formDataCopy.photo_profil instanceof File) {
          formDataToSend.append("photo_profil", formDataCopy.photo_profil)
        }
        return
      }

      const value = formDataCopy[key]
      if (value !== undefined && value !== null && value !== "") {
        formDataToSend.append(key, value)
      }
    })

    // Afficher les données envoyées pour vérification
    console.info("Données envoyées :", [...formDataToSend.entries()])

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/utilisateurs/${idUser}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 200) {
        toast.success("Profil mis à jour avec succès")
        setUtilisateur(response.data)
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error)
      toast.error("Erreur lors de la mise à jour du profil")
    }
  }

  // Ouvrir le modal de changement de mot de passe
  const openChangePasswordModal = () => {
    setShowChangePasswordModal(true)
  }

  // Fermer le modal de changement de mot de passe
  const closeChangePasswordModal = () => {
    setShowChangePasswordModal(false)
  }

  // Désinscription (anonymisation) de l'utilisateur
  const handleUnsubscribe = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir vous désinscrire ?")) {
      try {
        // Appel de la route PUT /utilisateurs/:id/anonymize
        await axios.put(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/utilisateurs/${idUser}/anonymize`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        // Affiche un toast pour signaler le succès de l'opération
        toast.success(
          "Vous avez été désinscrit. Vos données ont été anonymisées."
        )

        // 1) Déconnexion : retirer le token du localStorage
        localStorage.removeItem("authToken")

        // 2) Redirection vers la page principale ("/")
        window.location.href = "/"
      } catch (error) {
        console.error("Erreur lors de la désinscription :", error)
        toast.error("Erreur lors de la désinscription.")
      }
    }
  }

  return (
    <>
      <div className="header">
        <LogoutButton />
        {imageUrl || existingPhotoUrl ? (
          <img
            src={imageUrl || existingPhotoUrl}
            alt="Photo de profil"
            className="profilPicture"
          />
        ) : (
          <div className="profilPicture" />
        )}
        <div className="info-header">
          <h2>
            {formData.nom} {formData.prenom}
          </h2>
          <p>Rôle : {formData.role}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="formProfil">
        {/* Champ Nom */}
        <div className="form-group">
          <label htmlFor="nom">Nom*</label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>

        {/* Champ Prénom */}
        <div className="form-group">
          <label htmlFor="prenom">Prénom*</label>
          <input
            type="text"
            id="prenom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
        </div>

        {/* Champ Email */}
        <div className="form-group">
          <label htmlFor="email">Email*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Champ Pseudo */}
        <div className="form-group">
          <label htmlFor="pseudo">Pseudo*</label>
          <input
            type="text"
            id="pseudo"
            name="pseudo"
            value={formData.pseudo}
            onChange={handleChange}
            required
          />
        </div>

        {/* Champ Date de Naissance */}
        <div className="form-group">
          <label htmlFor="date_naissance">Date de naissance</label>
          <input
            type="date"
            id="date_naissance"
            name="date_naissance"
            value={formData.date_naissance}
            onChange={handleChange}
          />
        </div>

        {/* Champ Adresse */}
        <div className="form-group">
          <label htmlFor="adresse">Adresse</label>
          <input
            type="text"
            id="adresse"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
          />
        </div>

        {/* Champ Ville */}
        <div className="form-group">
          <label htmlFor="ville">Ville</label>
          <input
            type="text"
            id="ville"
            name="ville"
            value={formData.ville}
            onChange={handleChange}
          />
        </div>

        {/* Champ Téléphone */}
        <div className="form-group">
          <label htmlFor="telephone">Téléphone</label>
          <input
            type="tel"
            id="telephone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
          />
        </div>

        {/* Champ Bio */}
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          />
        </div>

        {/* Champ Photo de Profil */}
        <div className="form-group">
          <label htmlFor="photo_profil">Photo de profil</label>
          {/* {(imageUrl || existingPhotoUrl) && (
            <img
              src={imageUrl || existingPhotoUrl}
              alt="Photo de profil"
              className="profilPicture"
            />
          )} */}
          <input
            type="file"
            id="photo_profil"
            name="photo_profil"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="btn-update">
          Mettre à jour
        </button>
      </form>

      <button
        className="openChangePasswordButton"
        onClick={openChangePasswordModal}
      >
        Changer le mot de passe
      </button>
      <button className="btn-unsubscribe" onClick={handleUnsubscribe}>
        Se désinscrire
      </button>
      <p>
        * Obligatoire
        <br />
        info : Seul ton prénom, ton pseudo, ta bio et ta photo de profils sont
        rendu accésible uniquement aux personnes ayant un compte. Le reste des
        informations sont réservés aux administrateurs pour des raisons
        logistique ou pratiques.
      </p>

      {showChangePasswordModal && (
        <ChangePassword
          isOpen={showChangePasswordModal}
          onClose={closeChangePasswordModal}
          onPasswordChangeSuccess={closeChangePasswordModal}
          email={formData.email}
          idUser={idUser}
        />
      )}

      <ToastContainer />
    </>
  )
}
