import React, { useState, useRef, useContext } from "react"
import { AuthContext } from "../AuthContext"
import { useNavigate } from "react-router-dom"
import "./LoginSignup.scss"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import NavBar from "../components/NavBar/NavBar"
import { jwtDecode } from "jwt-decode";
import PasswordResetRequest from "../components/PasswordResetRequest/PasswordResetRequest"

const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION = 300000 // 5 minutes de verrouillage

const LoginSignup = () => {
  const { setAuthData } = useContext(AuthContext)
  const [isLogin, setIsLogin] = useState(true) // Basculer entre login et signup
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [signupForm, setSignupForm] = useState({
    pseudo: "",
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loginAttempts, setLoginAttempts] = useState([])
  const [isUserLocked, setIsUserLocked] = useState(false)
  const lockoutTimerRef = useRef(null)
  const navigate = useNavigate()
  const [showPasswordReset, setShowPasswordReset] = useState(false)
  const togglePasswordReset = () => {
    setShowPasswordReset(!showPasswordReset)
  }

  console.info("isUserLocked :", isUserLocked)

  const isPasswordStrong = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{12,})/
    return passwordRegex.test(password)
  }

  // Tests de robustesse du mot de passe (à titre indicatif)
  console.info(isPasswordStrong("Abc123!@#def")) // true (valide)
  console.info(isPasswordStrong("abc123!@#def")) // false (pas de majuscule)
  console.info(isPasswordStrong("ABC123!@#DEF")) // false (pas assez long)
  console.info(isPasswordStrong("Abc12345678")) // false (pas de caractère spécial)

  // Gestion des tentatives de connexion infructueuses
  const lockoutUser = () => {
    setIsUserLocked(true)
    lockoutTimerRef.current = setTimeout(() => {
      clearLockout()
    }, LOCKOUT_DURATION)

    toast.error(
      "Trop de tentatives infructueuses. Compte temporairement bloqué."
    )
  }

  const clearLockout = () => {
    setIsUserLocked(false)
    setLoginAttempts([])
    clearTimeout(lockoutTimerRef.current)
  }

  // Soumission du formulaire de connexion
  const handleLoginSubmit = async (e) => {
    e.preventDefault()

    if (isUserLocked) {
      toast.error(
        "Votre compte est temporairement bloqué. Veuillez réessayer plus tard."
      )
      return
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        {
          email: loginForm.email,
          password: loginForm.password,
        }
      )

      if (response.status === 200) {
        const token = response.data.token
        console.info("Connexion réussie")
        if (token) {
          // Stocker le token d'accès dans le localStorage
          localStorage.setItem("authToken", token)

          // Décoder le token pour récupérer les infos utilisateur
          const decodedToken = jwtDecode(token)

          // Mettre à jour l'état de connexion dans le contexte
          setAuthData({
            isAuthenticated: true,
            user: decodedToken,
            role: decodedToken.role,
            pseudo: decodedToken.pseudo,
            photo: decodedToken.photo,
            isLoading: false,
          })

          console.info("authData après connexion:", {
            isAuthenticated: true,
            user: decodedToken,
            role: decodedToken.role,
            pseudo: decodedToken.pseudo,
            photo: decodedToken.photo,
            isLoading: false,
          })

          // Rediriger vers la page d'accueil
          console.info("Redirection vers la page d'accueil")
          navigate("/")
        } else {
          console.error("Token non fourni dans la réponse du serveur.")
          toast.error("Erreur lors de la connexion. Veuillez réessayer.")
        }
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error)
      toast.error("Email ou mot de passe incorrect.")
      setLoginAttempts([...loginAttempts, Date.now()])

      if (loginAttempts.length >= MAX_LOGIN_ATTEMPTS) {
        lockoutUser()
      }
    }
  }

  // Soumission du formulaire d'inscription
  const handleSignupSubmit = async (e) => {
    e.preventDefault()

    if (!isPasswordStrong(signupForm.password)) {
      return toast.error(
        "Le mot de passe doit contenir au moins 12 caractères, un chiffre, une lettre en majuscule et un caractère spécial."
      )
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      return toast.error("Les mots de passe ne correspondent pas.")
    }

    try {
      // Ici, on indique qu'en s'inscrivant, l'utilisateur accepte les CGU et les cookies.
      // On suppose que le back prendra en compte `cgu_accepted` et `cookies_accepted`.
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/utilisateurs`,
        {
          nom: signupForm.nom,
          prenom: signupForm.prenom,
          pseudo: signupForm.pseudo,
          email: signupForm.email,
          password: signupForm.password,
          cgu_accepted: true,
          cookies_accepted: true,
        }
      )

      if (response.status === 201) {
        toast.success("Inscription réussie !")
        // On peut ajouter un message ou un lien vers les CGU
        setIsLogin(true) // Retourner au formulaire de connexion
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error(
          "L'email ou le pseudo est déjà utilisé. Veuillez en choisir un autre."
        )
      } else {
        console.error("Erreur lors de l'inscription :", error)
        toast.error("Erreur lors de l'inscription. Veuillez réessayer.")
      }
    }
  }

  // Basculer entre Connexion et Inscription
  const toggleForm = () => {
    setIsLogin(!isLogin)
  }

  // Gérer les changements dans le formulaire de connexion
  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginForm((prevForm) => ({ ...prevForm, [name]: value }))
  }

  // Gérer les changements dans le formulaire d'inscription
  const handleSignupChange = (e) => {
    const { name, value } = e.target
    setSignupForm((prevForm) => ({ ...prevForm, [name]: value }))
  }

  return (
    <>
      <NavBar />
      <div className="login-signup-container">
        <div className="form-container">
          {!showPasswordReset ? (
            isLogin ? (
              <form onSubmit={handleLoginSubmit}>
                <h2>Connexion</h2>
                <div className="form-group">
                  <label htmlFor="loginemail">Email</label>
                  <input
                    type="email"
                    id="loginemail"
                    name="email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="loginPassword">Mot de passe</label>
                  <input
                    type="password"
                    id="loginPassword"
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    required
                  />
                </div>
                <button type="submit" className="btn-submit">
                  Connexion
                </button>
                <p className="toggle-text">
                  Mot de passe oublié ?{" "}
                  <span onClick={togglePasswordReset}>Réinitialiser ici</span>
                </p>
                <p className="toggle-text">
                  Vous n'avez pas de compte ?{" "}
                  <span onClick={toggleForm}>Inscrivez-vous ici</span>
                </p>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit}>
                <h2>Inscription</h2>
                <p>
                  En créant un compte, vous acceptez les CGU et l’utilisation de
                  cookies nécessaires au bon fonctionnement du site.
                </p>
                <div className="form-group">
                  <label htmlFor="signupNom">Nom</label>
                  <input
                    type="text"
                    id="signupNom"
                    name="nom"
                    value={signupForm.nom}
                    onChange={handleSignupChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signupPrenom">Prénom</label>
                  <input
                    type="text"
                    id="signupPrenom"
                    name="prenom"
                    value={signupForm.prenom}
                    onChange={handleSignupChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signupEmail">Email</label>
                  <input
                    type="email"
                    id="signupEmail"
                    name="email"
                    value={signupForm.email}
                    onChange={handleSignupChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signupPseudo">Pseudo</label>
                  <input
                    type="text"
                    id="signupPseudo"
                    name="pseudo"
                    value={signupForm.pseudo}
                    onChange={handleSignupChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signupPassword">Mot de passe</label>
                  <input
                    type="password"
                    id="signupPassword"
                    name="password"
                    value={signupForm.password}
                    onChange={handleSignupChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    Confirmez le mot de passe
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={signupForm.confirmPassword}
                    onChange={handleSignupChange}
                    required
                  />
                </div>
                <button type="submit" className="btn-submit">
                  Inscription
                </button>
                <p className="toggle-text">
                  Vous avez déjà un compte ?{" "}
                  <span onClick={toggleForm}>Connectez-vous ici</span>
                </p>
              </form>
            )
          ) : (
            <PasswordResetRequest togglePasswordReset={togglePasswordReset} />
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  )
}

export default LoginSignup
