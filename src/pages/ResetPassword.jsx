// src/pages/ResetPassword.jsx

import React, { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import axios from "axios"

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const [newPassword, setNewPassword] = useState("")
  const [statusMessage, setStatusMessage] = useState("")

  // Hook pour rediriger
  const navigate = useNavigate()

  // Récupère le token depuis l’URL
  const token = searchParams.get("token")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/password-reset-confirm`,
        {
          token,
          newPassword,
        }
      )

      // En cas de succès, on affiche le message...
      setStatusMessage(
        response.data.message || "Mot de passe réinitialisé avec succès !"
      )

      // ... puis on redirige vers /login
      navigate("/login")
    } catch (error) {
      setStatusMessage("Erreur lors de la réinitialisation du mot de passe.")
      console.error(error)
    }
  }

  return (
    <div>
      <h2>Réinitialiser votre mot de passe</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <h1>Nouveau mot de passe :</h1>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Valider</button>
      </form>
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  )
}
