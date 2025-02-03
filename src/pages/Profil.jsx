import React, { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import NavBar from "../components/NavBar/NavBar"
import ToggleSwitch from "../components/ToggleSwitch/ToggleSwitch"
import { AuthContext } from "../AuthContext"
import ModificationProfil from "../components/ModificationProfil/ModificationProfil"
import "./Profil.scss"
import PlayerGames from "../components/PlayerGames/PlayerGames"

export default function Profil() {
  const [showListeParties, setShowListeParties] = useState(true)
  const navigate = useNavigate()
  const { authData } = useContext(AuthContext)

  const utilisateur = authData.user

  console.info("Profil Component Rendered")
  console.info("authData de Profil: ", authData)

  useEffect(() => {
    if (authData.isLoading) {
      console.info("Authentication is loading...")
      // Ne faites rien tant que l'authentification est en cours de vérification
      return
    }

    if (!authData.isAuthenticated || !utilisateur) {
      console.info("User is not logged in, redirecting to /login")
      navigate("/login")
    } else {
      console.info("User is logged in: ", utilisateur)
    }
  }, [authData.isAuthenticated, authData.isLoading, utilisateur, navigate])

  // const handleLogout = () => {
  //   console.info("User logging out...")
  //   logout()
  //   navigate("/")
  // }

  // Affichage d'un indicateur de chargement si l'authentification est en cours
  if (authData.isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <>
      <NavBar className="NavBarHome" />
      <div className="pageProfil">
        <h1 className="bienvenueName">
          Bienvenue {utilisateur ? utilisateur.pseudo : "Chargement..."}
        </h1>

        <div className="boutonSwitch">
          <p>Modifier mon profil</p>
          <ToggleSwitch
            isChecked={showListeParties}
            onChange={() => setShowListeParties(!showListeParties)}
          />
          <p>Tableau de bord des parties</p>
        </div>

        {/* <button className="logoutButton" onClick={handleLogout}>
          Se déconnecter
        </button> */}

        <div className="globalBoxProfil">
          {showListeParties ? <PlayerGames /> : <ModificationProfil />}
        </div>
      </div>
    </>
  )
}
