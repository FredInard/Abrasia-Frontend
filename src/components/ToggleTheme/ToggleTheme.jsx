// ToggleTheme.jsx
import React, { useState, useEffect } from "react"
import { Icon } from "@iconify/react"
import sunIcon from "@iconify/icons-feather/sun"
import moonIcon from "@iconify/icons-feather/moon"
import "./ToggleTheme.scss" // Importation du fichier SCSS

function ToggleTheme() {
  // État pour gérer le thème (true pour le mode sombre)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("isDarkMode")
    return savedTheme !== null ? JSON.parse(savedTheme) : true
  })

  // Effet pour appliquer le thème et sauvegarder la préférence
  useEffect(() => {
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode))
    if (isDarkMode) {
      document.body.classList.add("dark-mode")
      document.body.classList.remove("light-mode")
    } else {
      document.body.classList.add("light-mode")
      document.body.classList.remove("dark-mode")
    }
  }, [isDarkMode])

  // Fonction pour basculer le thème
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <label className="toggle-theme" htmlFor="checkbox">
      {/* Checkbox pour le toggle */}
      <input
        className="toggle-checkbox"
        type="checkbox"
        id="checkbox"
        checked={!isDarkMode}
        onChange={toggleTheme}
        aria-label="Toggle Theme"
      />
      {/* Slot du toggle */}
      <div className="toggle-slot">
        {/* Icône du soleil */}
        <div className="sun-icon-wrapper">
          <Icon icon={sunIcon} className="sun-icon" />
        </div>
        {/* Bouton du toggle */}
        <div className="toggle-button"></div>
        {/* Icône de la lune */}
        <div className="moon-icon-wrapper">
          <Icon icon={moonIcon} className="moon-icon" />
        </div>
      </div>
    </label>
  )
}

export default ToggleTheme
