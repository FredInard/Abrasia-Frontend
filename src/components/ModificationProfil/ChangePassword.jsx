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
  const [pwdScore, setPwdScore] = useState(0)
  const modalRef = useRef(null)
  console.info("userId :", idUser)
  const authToken = localStorage.getItem("authToken")

  // Vérification de robustesse du mot de passe
  const isStrongPassword = (pwd) => {
    // Au moins 12 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/.test(pwd)
  }

  // Évalue la force et les règles non respectées
  const evaluatePassword = (pwd) => {
    const rules = [
      { id: "len", label: "Au moins 12 caractères", ok: pwd.length >= 12 },
      { id: "upper", label: "Au moins une majuscule", ok: /[A-Z]/.test(pwd) },
      { id: "digit", label: "Au moins un chiffre", ok: /\d/.test(pwd) },
      { id: "special", label: "Au moins un caractère spécial", ok: /[^A-Za-z0-9]/.test(pwd) },
    ]
    const score = rules.reduce((acc, r) => acc + (r.ok ? 1 : 0), 0)
    setPwdScore(score)
  }

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

    // Valider la robustesse AVANT de vérifier l'ancien mot de passe
    if (!isStrongPassword(password)) {
      toast.warning(
        "Le nouveau mot de passe doit contenir au minimum 12 caractères, au moins une majuscule, un chiffre et un caractère spécial."
      )
      return
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        {
          email,
          motDePasse: oldPassword,
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
          motDePasse: password,
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
            onChange={(e) => {
              const val = e.target.value
              setPassword(val)
              evaluatePassword(val)
            }}
          />
          {/* Indicateur de robustesse */}
          <div style={{ marginTop: 8 }}>
            <div
              aria-label="Barre force mot de passe"
              style={{
                height: 6,
                borderRadius: 4,
                background: "#eee",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${(pwdScore / 4) * 100}%`,
                  height: "100%",
                  transition: "width 200ms ease",
                  background:
                    pwdScore <= 1 ? "#e74c3c" : pwdScore === 2 ? "#f1c40f" : pwdScore === 3 ? "#27ae60" : "#2ecc71",
                }}
              />
            </div>
            <ul style={{ margin: "8px 0 0", paddingLeft: 18, fontSize: 12 }}>
              <li style={{ color: password.length >= 12 ? "#27ae60" : "#e74c3c" }}>Au moins 12 caractères</li>
              <li style={{ color: /[A-Z]/.test(password) ? "#27ae60" : "#e74c3c" }}>Au moins une majuscule</li>
              <li style={{ color: /\d/.test(password) ? "#27ae60" : "#e74c3c" }}>Au moins un chiffre</li>
              <li style={{ color: /[^A-Za-z0-9]/.test(password) ? "#27ae60" : "#e74c3c" }}>Au moins un caractère spécial</li>
            </ul>
          </div>
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
