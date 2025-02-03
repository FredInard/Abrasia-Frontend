import React from "react"
import "./Footer.scss" // Style associé

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Liens de navigation */}
        <div className="footer-links">
          <ul>
            <li>
              <a href="/">Accueil</a>
            </li>
            <li>
              <a href="/creer-partie">Créer une partie</a>
            </li>
            <li>
              <a href="/association">L'association</a>
            </li>
            <li>
              <a href="/equipe">L'équipe</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div>

        {/* Réseaux sociaux */}
        {/* <div className="footer-social">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-instagram"></i>
          </a>
        </div> */}
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>
          &copy; 2024 Association de jeux de rôle Les Arpenteurs d'Abrasia. Tous
          droits réservés.
        </p>
        <a href="/Cgu">Conditions Générales d'Utilisation (CGU)</a>
      </div>
    </footer>
  )
}

export default Footer
