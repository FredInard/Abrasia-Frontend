// src/components/AdminTabs/UsersTab.jsx

import React, { useState, useEffect } from "react"
import axios from "axios"
import "./UsersTab.scss"

// Import des icônes
import deleteIcon from "../../assets/pics/icons8-déchets-50.png"
import editIcon from "../../assets/pics/icons8-main-avec-stylo-100.png"

const UsersTab = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // AJOUT : nouveau champ pour le mot de passe
  const [formData, setFormData] = useState({
    pseudo: "",
    email: "",
    role: "membre",
    nom: "",
    prenom: "",
    date_de_naissance: "",
    telephone: "",
    adresse: "",
    code_postal: "",
    ville: "",
    pays: "",
    newPassword: "", // <-- AJOUT
  })

  // États pour les filtres
  const [filterPseudo, setFilterPseudo] = useState("")
  const [filterEmail, setFilterEmail] = useState("")
  const [filterRole, setFilterRole] = useState("")

  const authToken = localStorage.getItem("authToken")

  // Vérification robustesse mot de passe
  const [pwdScore, setPwdScore] = useState(0)
  const isStrongPassword = (pwd) => /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/.test(pwd)
  const evaluatePassword = (pwd) => {
    const rulesOk = [
      pwd.length >= 12,
      /[A-Z]/.test(pwd),
      /\d/.test(pwd),
      /[^A-Za-z0-9]/.test(pwd),
    ]
    setPwdScore(rulesOk.filter(Boolean).length)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [users, filterPseudo, filterEmail, filterRole])

  const fetchUsers = () => {
    setLoading(true)
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/utilisateurs`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        setUsers(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des utilisateurs :", error)
        setError("Erreur lors du chargement des utilisateurs.")
        setLoading(false)
      })
  }

  const applyFilters = () => {
    let filtered = users

    if (filterPseudo.trim() !== "") {
      filtered = filtered.filter((user) =>
        user.pseudo.toLowerCase().includes(filterPseudo.toLowerCase())
      )
    }

    if (filterEmail.trim() !== "") {
      filtered = filtered.filter((user) =>
        user.email.toLowerCase().includes(filterEmail.toLowerCase())
      )
    }

    if (filterRole !== "") {
      filtered = filtered.filter((user) => user.role === filterRole)
    }

    setFilteredUsers(filtered)
  }

  const handleDelete = (userId) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      axios
        .delete(`${import.meta.env.VITE_BACKEND_URL}/utilisateurs/${userId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then(() => {
          fetchUsers()
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la suppression de l'utilisateur :",
            error
          )
          setError("Erreur lors de la suppression de l'utilisateur.")
        })
    }
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setFormData({
      pseudo: user.pseudo || "",
      email: user.email || "",
      role: user.role || "membre",
      nom: user.nom || "",
      prenom: user.prenom || "",
      date_de_naissance: user.date_de_naissance
        ? new Date(user.date_de_naissance).toISOString().slice(0, 10)
        : "",
      telephone: user.telephone || "",
      adresse: user.adresse || "",
      code_postal: user.code_postal || "",
      ville: user.ville || "",
      pays: user.pays || "",
      newPassword: "", // Réinitialise le champ mot de passe
    })
    setIsEditing(true)
  }

  // const handleCreate = () => {
  //   ...
  // };

  // Fonction principale de soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isEditing) {
      // 1) Mettre à jour les autres informations de l'utilisateur
      try {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/utilisateurs/${selectedUser.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        // 2) Mettre à jour le mot de passe s’il y a un newPassword (envoyer motDePasse)
        if (formData.newPassword && formData.newPassword.trim().length > 0) {
          if (!isStrongPassword(formData.newPassword)) {
            setError(
              "Le nouveau mot de passe doit contenir au minimum 12 caractères, au moins une majuscule, un chiffre et un caractère spécial."
            )
            return
          }
          await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/utilisateurs/${selectedUser.id}/changerMotDePasse`,
            { motDePasse: formData.newPassword },
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          )
        }
        // Terminé, on rafraîchit la liste des utilisateurs
        setIsEditing(false)
        setSelectedUser(null)
        fetchUsers()
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", error)
        setError("Erreur lors de la mise à jour de l'utilisateur.")
      }
    } else if (isCreating) {
      // Création d’un nouvel utilisateur
      // ...
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsCreating(false)
    setSelectedUser(null)
    setFormData({
      pseudo: "",
      email: "",
      role: "membre",
      nom: "",
      prenom: "",
      date_de_naissance: "",
      telephone: "",
      adresse: "",
      code_postal: "",
      ville: "",
      pays: "",
      newPassword: "", // <-- AJOUT
    })
  }

  if (loading) {
    return <p>Chargement des utilisateurs...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div className="users-tab">
      <h2>Gestion des utilisateurs</h2>
      {/* <button onClick={handleCreate}>Créer un nouvel utilisateur</button> */}
      {/* Champs de filtre */}
      {!isEditing && !isCreating && (
        <div className="filters">
          <div>
            <label htmlFor="filterPseudo">Filtrer par pseudo :</label>
            <input
              type="text"
              id="filterPseudo"
              value={filterPseudo}
              onChange={(e) => setFilterPseudo(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="filterEmail">Filtrer par email :</label>
            <input
              type="text"
              id="filterEmail"
              value={filterEmail}
              onChange={(e) => setFilterEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="filterRole">Filtrer par rôle :</label>
            <select
              id="filterRole"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="">Tous</option>
              <option value="membre">Membre</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
        </div>
      )}

      {isEditing || isCreating ? (
        <form onSubmit={handleSubmit} className="user-form">
          <div>
            <label htmlFor="pseudo">Pseudo :</label>
            <input
              type="text"
              id="pseudo"
              name="pseudo"
              value={formData.pseudo}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="role">Rôle :</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="membre">Membre</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
          <div>
            <label htmlFor="nom">Nom :</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="prenom">Prénom :</label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="date_de_naissance">Date de naissance :</label>
            <input
              type="date"
              id="date_de_naissance"
              name="date_de_naissance"
              value={formData.date_de_naissance}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="telephone">Téléphone :</label>
            <input
              type="tel"
              id="telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="adresse">Adresse :</label>
            <input
              type="text"
              id="adresse"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="code_postal">Code postal :</label>
            <input
              type="text"
              id="code_postal"
              name="code_postal"
              value={formData.code_postal}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="ville">Ville :</label>
            <input
              type="text"
              id="ville"
              name="ville"
              value={formData.ville}
              onChange={handleChange}
            />
          </div>
          {/* <div>
            <label htmlFor="pays">Pays :</label>
            <input
              type="text"
              id="pays"
              name="pays"
              value={formData.pays}
              onChange={handleChange}
            />
          </div> */}

          {/* AJOUT : Champ du nouveau mot de passe */}
          <div>
            <label htmlFor="newPassword">Nouveau mot de passe :</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={(e) => {
                handleChange(e)
                evaluatePassword(e.target.value)
              }}
            />
            {/* Indicateur de robustesse */}
            <div style={{ marginTop: 8 }}>
              <div
                aria-label="Barre force mot de passe"
                style={{ height: 6, borderRadius: 4, background: "#eee", overflow: "hidden" }}
              >
                <div
                  style={{
                    width: `${(pwdScore / 4) * 100}%`,
                    height: "100%",
                    transition: "width 200ms ease",
                    background: pwdScore <= 1 ? "#e74c3c" : pwdScore === 2 ? "#f1c40f" : pwdScore === 3 ? "#27ae60" : "#2ecc71",
                  }}
                />
              </div>
              <ul style={{ margin: "8px 0 0", paddingLeft: 18, fontSize: 12 }}>
                <li style={{ color: formData.newPassword.length >= 12 ? "#27ae60" : "#e74c3c" }}>Au moins 12 caractères</li>
                <li style={{ color: /[A-Z]/.test(formData.newPassword) ? "#27ae60" : "#e74c3c" }}>Au moins une majuscule</li>
                <li style={{ color: /\d/.test(formData.newPassword) ? "#27ae60" : "#e74c3c" }}>Au moins un chiffre</li>
                <li style={{ color: /[^A-Za-z0-9]/.test(formData.newPassword) ? "#27ae60" : "#e74c3c" }}>Au moins un caractère spécial</li>
              </ul>
            </div>
          </div>

          <button type="submit">
            {isEditing ? "Mettre à jour l'utilisateur" : "Créer l'utilisateur"}
          </button>
          <button type="button" onClick={handleCancel}>
            Annuler
          </button>
        </form>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Pseudo</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.pseudo}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td className="actions">
                    <img
                      src={editIcon}
                      alt="Modifier"
                      className="action-icon edit-icon"
                      onClick={() => handleEdit(user)}
                    />
                    <img
                      src={deleteIcon}
                      alt="Supprimer"
                      className="action-icon delete-icon"
                      onClick={() => handleDelete(user.id)}
                    />
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

export default UsersTab
