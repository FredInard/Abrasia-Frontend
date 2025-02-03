import React, { useState, useRef, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./ChangePassword.scss"

function ChangePassword({
  isOpen,
  onClose,
  onPasswordChangeSuccess,
  email,
  idUser,
}) {
  const [oldPassword, setOldPassword] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const modalRef = useRef(null)
  console.info("userId :", idUser)
  const authToken = localStorage.getItem("authToken")

  useEffect(() => {
    function handleOutsideClick(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick)
    } else {
      document.removeEventListener("mousedown", handleOutsideClick)
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [isOpen, onClose])

  const handleChangePassword = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        {
          email,
          password: oldPassword,
        }
      )

      if (response.status === 200) {
        console.info("Ancien mot de passe vérifié avec succès !")
        toast.success("Ancien mot de passe vérifié avec succès.")
        handleChangePassword2()
      } else {
        console.error("Ancien mot de passe incorrect.")
        toast.error("L'ancien mot de passe est incorrect.")
      }
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de l'ancien mot de passe :",
        error
      )
      if (error.response?.status === 401) {
        toast.error("L'ancien mot de passe est incorrect.")
      } else {
        toast.error("Une erreur est survenue. Veuillez réessayer.")
      }
    }
  }

  const handleChangePassword2 = async () => {
    if (password !== confirmPassword) {
      toast.warning("Les mots de passe ne correspondent pas.")
      return
    }

    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/utilisateurs/${idUser}/changerMotDePasse`,
        {
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )

      if (
        response.status === 200 ||
        response.status === 201 ||
        response.status === 204
      ) {
        console.info("Mot de passe modifié avec succès !")
        toast.success("Mot de passe modifié avec succès.")
        onClose()
        onPasswordChangeSuccess()
      } else {
        console.error(
          "Erreur lors de la modification du mot de passe :",
          response
        )
        toast.error(
          "Une erreur est survenue lors de la modification du mot de passe."
        )
      }
    } catch (error) {
      console.error("Erreur lors de la modification du mot de passe :", error)
      toast.error(
        "Une erreur est survenue lors de la modification du mot de passe."
      )
    }
  }

  return (
    <div
      className="modalChangePW"
      style={{ display: isOpen ? "block" : "none" }}
    >
      <div className="modalContent" ref={modalRef}>
        <h2 className="titleChangePW">Changer le mot de passe</h2>
        <div className="divChangePWThird">
          <h2 className="titleChangePW">Ancien mot de passe:</h2>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div className="divChangePWFirst">
          <h2 className="titleChangePW">Nouveau mot de passe:</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="divChangePWSecond">
          <h2 className="titleChangePW">Confirmer le mot de passe:</h2>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button className="buttonChangePW" onClick={handleChangePassword}>
          Changer le mot de passe
        </button>
      </div>
    </div>
  )
}

export default ChangePassword
