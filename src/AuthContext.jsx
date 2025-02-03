import React, { createContext, useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"; // Importation corrigée

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    isAuthenticated: false,
    user: null,
    role: null,
    pseudo: null, // Ajoutez le pseudo
    photo: null,
    isLoading: true,
  })

  // Gestion de la déconnexion :
  const logout = () => {
    console.info("Déconnexion utilisateur.")
    localStorage.removeItem("authToken")
    setAuthData({
      isAuthenticated: false,
      user: null,
      role: null,
      pseudo: null, // Ajoutez le pseudo
      photo: null, // Ajoutez la photo
      isLoading: false,
    })
  }

  // Gestion de la connexion :
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    console.info("Vérification du token stocké : ", token)

    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        if (decodedToken.exp * 1000 < Date.now()) {
          console.warn("Le token a expiré.")
          logout()
        } else {
          setAuthData({
            isAuthenticated: true,
            user: decodedToken,
            role: decodedToken.role,
            pseudo: decodedToken.pseudo, // Ajoutez le pseudo
            photo: decodedToken.photo_profil, // Ajoutez la photo
            isLoading: false,
          })
        }
        console.info("Token décodé, rôle :", decodedToken.role)

        setAuthData({
          isAuthenticated: true,
          user: decodedToken,
          role: decodedToken.role,
          pseudo: null,
          photo: null,
          isLoading: false,
        })
      } catch (error) {
        console.error("Token invalide :", error)
        localStorage.removeItem("authToken")
        setAuthData({
          isAuthenticated: false,
          user: null,
          role: null,
          pseudo: null,
          photo: null,
          isLoading: false,
        })
      }
    } else {
      console.info("Pas de token présent. L'utilisateur n'est pas connecté.")
      setAuthData({
        isAuthenticated: false,
        user: null,
        role: null,
        isLoading: false,
      })
    }
  }, [])

  const value = {
    authData,
    setAuthData,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
