// import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode";
import "./NavBar.scss" // <-- fichier SCSS
import ToggleTheme from "../ToggleTheme/ToggleTheme"
// import logo from "../../assets/pics/logoArpenteurBlanc.svg"
import IconHome from "../../assets/pics/IconHome.svg"
import IconReception from "../../assets/pics/IconReception.svg"
import IconAsso from "../../assets/pics/IconAsso.svg"
import IconCreatePartie from "../../assets/pics/IconCreatePartie.svg"
import IconProfile from "../../assets/pics/IconProfile.svg"
import IconSetting from "../../assets/pics/IconSetting.svg"

const NavBar = () => {
  const navigate = useNavigate()

  const token = localStorage.getItem("authToken")
  let authData = {
    isAuthenticated: false,
    role: null,
  }

  if (token) {
    try {
      const decodedToken = jwtDecode(token)
      const currentTime = Date.now() / 1000

      if (decodedToken.exp > currentTime) {
        authData = {
          isAuthenticated: true,
          role: decodedToken.role,
        }
      } else {
        localStorage.removeItem("authToken")
        navigate("/login")
      }
    } catch (err) {
      console.error("Erreur lors du décodage du token :", err)
      localStorage.removeItem("authToken")
      navigate("/login")
    }
  }

  // const handleLogout = () => {
  //   localStorage.removeItem("authToken")
  //   navigate("/")
  // }

  return (
    <>
      {/* Navbar Desktop */}
      <nav className="navbar desktop">
        <div className="navbar-logo">
          {/* <NavLink to="/">
            <img src={logo} alt="Logo de l'association" />
          </NavLink> */}
        </div>
        <ToggleTheme />
        <ul className="navbar-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <li>Accueil</li>
          </NavLink>

          {authData.isAuthenticated && (
            <NavLink
              to="/creer-partie"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <li>Créer partie</li>
            </NavLink>
          )}

          <NavLink
            to="/association"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <li>L'association</li>
          </NavLink>

          {authData.isAuthenticated && (
            <NavLink
              to="/profil"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <li>Mon Profil</li>
            </NavLink>
          )}

          {authData.role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <li>Administration</li>
            </NavLink>
          )}

          {!authData.isAuthenticated && (
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <li>Connexion</li>
            </NavLink>
          )}
        </ul>
      </nav>

      {/* Navbar Mobile */}
      <nav className="navbar mobile">
        {/* <ToggleTheme /> */}
        <ul className="navbar-icons">
          <li>
            <NavLink to="/">
              <img src={IconReception} alt="Accueil" />
            </NavLink>
          </li>
          {authData.isAuthenticated && (
            <li>
              <NavLink to="/creer-partie">
                <img src={IconCreatePartie} alt="Créer partie" />
              </NavLink>
            </li>
          )}
          <li>
            <NavLink to="/association">
              <img src={IconAsso} alt="L'association" />
            </NavLink>
          </li>
          {authData.isAuthenticated && (
            <li>
              <NavLink to="/profil">
                <img src={IconProfile} alt="Mon Profil" />
              </NavLink>
            </li>
          )}
          {authData.role === "admin" && (
            <li>
              <NavLink to="/admin">
                <img src={IconSetting} alt="Administration" />
              </NavLink>
            </li>
          )}
          {!authData.isAuthenticated && (
            <li>
              <NavLink to="/login">
                <img src={IconHome} alt="Connexion" />
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </>
  )
}

export default NavBar
