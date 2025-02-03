// src/pages/AdminPage/AdminPage.jsx

import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode";
import axios from "axios"
import UsersTab from "../components/AdminTabs/UsersTab"
import PartiesTab from "../components/AdminTabs/PartiesTab"
import ParticipationsTab from "../components/AdminTabs/ParticipationsTab"
import CarpoolTab from "../components/AdminTabs/CarpoolTab"
import NourritureTab from "../components/AdminTabs/NourritureTab"
import "./AdminPage.scss"
import NavBar from "../components/NavBar/NavBar"

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("users")
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        setUser(decodedToken)

        if (decodedToken.role !== "admin") {
          // Rediriger si l'utilisateur n'est pas administrateur
          navigate("/not-authorized")
        }
      } catch (err) {
        console.error("Erreur lors du décodage du token :", err)
        navigate("/login")
      }
    } else {
      // Rediriger vers la page de connexion si non connecté
      navigate("/login")
    }
  }, [navigate])

  const handleExport = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/export/all`,
        {
          responseType: "blob", // Pour recevoir le fichier en tant que blob
        }
      )

      // Créer un lien de téléchargement pour le fichier Excel
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "all_data.xlsx") // Nom du fichier
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Erreur lors de l'exportation des données :", error)
      alert("Une erreur s'est produite lors de l'exportation des données.")
    }
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case "users":
        return <UsersTab />
      case "parties":
        return <PartiesTab />
      case "participations":
        return <ParticipationsTab />
      case "carpool":
        return <CarpoolTab />
      case "nourriture":
        return <NourritureTab />
      default:
        return <UsersTab />
    }
  }

  console.info("user", user)
  return (
    <>
      <NavBar />
      <div className="admin-page">
        <h1>Bienvenue, {user && user.pseudo} !</h1>
        <h1>Tableau de bord administrateur</h1>
        <div className="tabs">
          <button
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            Utilisateurs
          </button>
          <button
            className={activeTab === "parties" ? "active" : ""}
            onClick={() => setActiveTab("parties")}
          >
            Parties
          </button>
          <button
            className={activeTab === "participations" ? "active" : ""}
            onClick={() => setActiveTab("participations")}
          >
            Participations
          </button>
          <button
            className={activeTab === "carpool" ? "active" : ""}
            onClick={() => setActiveTab("carpool")}
          >
            Covoiturages
          </button>
          <button
            className={activeTab === "nourriture" ? "active" : ""}
            onClick={() => setActiveTab("nourriture")}
          >
            Nourriture
          </button>
        </div>
        <div className="actions">
          <button className="export-button" onClick={handleExport}>
            Exporter toutes les données
          </button>
        </div>
        <div className="tab-content">{renderActiveTab()}</div>
      </div>
    </>
  )
}

export default AdminPage
