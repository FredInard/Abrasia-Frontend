import React, { useState, useRef, useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.scss";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../components/NavBar/NavBar";
import { jwtDecode } from "jwt-decode";
import PasswordResetRequest from "../components/PasswordResetRequest/PasswordResetRequest";

// ✅ Constantes globales pour éviter la répétition de valeurs magiques
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

const LoginSignup = () => {
  const { setAuthData } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    pseudo: "",
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loginAttempts, setLoginAttempts] = useState([]);
  const [isUserLocked, setIsUserLocked] = useState(false);
  const lockoutTimerRef = useRef(null);
  const navigate = useNavigate();
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  // ✅ Vérifier si l'utilisateur est verrouillé
  useEffect(() => {
    if (loginAttempts.length >= MAX_LOGIN_ATTEMPTS) {
      setIsUserLocked(true);
      toast.error("Trop de tentatives infructueuses. Compte temporairement bloqué.");

      lockoutTimerRef.current = setTimeout(() => {
        setIsUserLocked(false);
        setLoginAttempts([]);
      }, LOCKOUT_DURATION_MS);
    }
  }, [loginAttempts]);

  // ✅ Vérification de la robustesse du mot de passe
  const isPasswordStrong = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{12,})/;
    return passwordRegex.test(password);
  };

  // ✅ Basculer entre Connexion et Inscription
  const toggleForm = () => setIsLogin((prev) => !prev);
  const togglePasswordReset = () => setShowPasswordReset((prev) => !prev);

  // ✅ Gérer les changements dans les formulaires
  const handleInputChange = (e, setForm) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  // ✅ Gestion de la connexion
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (isUserLocked) {
      return toast.error("Votre compte est temporairement bloqué. Veuillez réessayer plus tard.");
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, loginForm);

      if (response.status === 200 && response.data.token) {
        const token = response.data.token;
        localStorage.setItem("authToken", token);
        const decodedToken = jwtDecode(token);

        setAuthData({
          isAuthenticated: true,
          user: decodedToken,
          role: decodedToken.role,
          pseudo: decodedToken.pseudo,
          photo: decodedToken.photo,
          isLoading: false,
        });

        toast.success("Connexion réussie !");
        navigate("/");
      } else {
        throw new Error("Réponse invalide du serveur.");
      }
    } catch (error) {
      console.error("❌ Erreur lors de la connexion :", error);
      toast.error("Email ou mot de passe incorrect.");
      setLoginAttempts((prevAttempts) => [...prevAttempts, Date.now()]);
    }
  };

  // ✅ Gestion de l'inscription
  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordStrong(signupForm.password)) {
      return toast.error("Le mot de passe doit contenir au moins 12 caractères, un chiffre, une majuscule et un caractère spécial.");
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      return toast.error("Les mots de passe ne correspondent pas.");
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/utilisateurs`, {
        ...signupForm,
        cgu_accepted: true,
        cookies_accepted: true,
      });

      if (response.status === 201) {
        toast.success("Inscription réussie !");
        setIsLogin(true);
      }
    } catch (error) {
      console.error("❌ Erreur lors de l'inscription :", error);
      toast.error(error.response?.status === 409 ? "L'email ou le pseudo est déjà utilisé." : "Erreur lors de l'inscription.");
    }
  };

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
                  <label htmlFor="loginEmail">Email</label>
                  <input type="email" id="loginEmail" name="email" value={loginForm.email} onChange={(e) => handleInputChange(e, setLoginForm)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="loginPassword">Mot de passe</label>
                  <input type="password" id="loginPassword" name="password" value={loginForm.password} onChange={(e) => handleInputChange(e, setLoginForm)} required />
                </div>
                <button type="submit" className="btn-submit">Connexion</button>
                <p className="toggle-text">Mot de passe oublié ? <span onClick={togglePasswordReset}>Réinitialiser ici</span></p>
                <p className="toggle-text">Vous n'avez pas de compte ? <span onClick={toggleForm}>Inscrivez-vous ici</span></p>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit}>
                <h2>Inscription</h2>
                <p>En créant un compte, vous acceptez les CGU et l’utilisation de cookies nécessaires au bon fonctionnement du site.</p>
                {["nom", "prenom", "pseudo", "email", "password", "confirmPassword"].map((field) => (
                  <div className="form-group" key={field}>
                    <label htmlFor={`signup${field}`}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    <input type={field.includes("password") ? "password" : "text"} id={`signup${field}`} name={field} value={signupForm[field]} onChange={(e) => handleInputChange(e, setSignupForm)} required />
                  </div>
                ))}
                <button type="submit" className="btn-submit">Inscription</button>
                <p className="toggle-text">Vous avez déjà un compte ? <span onClick={toggleForm}>Connectez-vous ici</span></p>
              </form>
            )
          ) : (
            <PasswordResetRequest togglePasswordReset={togglePasswordReset} />
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default LoginSignup;
