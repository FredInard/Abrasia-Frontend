import React, { useState } from "react"
import axios from "axios"

function PasswordResetRequest() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/password-reset-request`,
        { email }
      )
      setMessage(
        "Un email de réinitialisation a été envoyé si l'adresse existe."
      )
    } catch (error) {
      console.error("Erreur lors de la demande de réinitialisation :", error)
      setMessage("Une erreur s'est produite. Veuillez réessayer.")
    }
  }
  console.info("email :", email)
  console.info("message :", message)
  return (
    <div>
      <h2>Réinitialiser le mot de passe</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email :
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Envoyer</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

export default PasswordResetRequest
