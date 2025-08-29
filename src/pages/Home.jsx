import React, { useState, useEffect, useRef, useMemo } from "react"
import "./Home.scss"

import Calendar from "../components/schedule/Calendar"
import NavBar from "../components/NavBar/NavBar"
import Image1 from "../assets/pics/headerPictureD.png"
import iNeedYou from "../assets/pics/iNeedYou.svg"
import videoFile1 from "../../src/assets/videos/6380503_Playing Kids Boardgame Team_By_Pressmaster_Artlist_HD.mp4"
import videoFile2 from "../../src/assets/videos/6004610_Cheers Friends Drinking Drinking Glass_By_Evgenii_Petrunin_Artlist_HD.mp4"
import videoFile3 from "../../src/assets/videos/616337_Play Fun Hands Dice_By_Brock_Roberts_Artlist_HD.mp4"
import videoFile4 from "../../src/assets/videos/75093_Friends having beers together in a bar_By_JRVisuals_Artlist_HD.mp4"
import videoFile5 from "../../src/assets/videos/6380520_Snacks Crisps Tabletop Munching_By_Pressmaster_Artlist_HD.mp4"
import logoArpenteur from "../assets/pics/logoArpenteurBlanc.svg"

import Footer from "../components/Footer/Footer"
import GameList from "../components/Game/GameList"

export default function Home() {
  // Initialiser `selectedDate` avec la date d'aujourd'hui
  const today = new Date()
  const adjustedToday = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  )
  const formattedToday = adjustedToday.toISOString().split("T")[0]
  const [selectedDate, setSelectedDate] = useState(formattedToday)

  // Définissez `handleDateSelect` pour mettre à jour `selectedDate`
  const handleDateSelect = (date) => {
    const adjustedDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
    const formattedDate = adjustedDate.toISOString().split("T")[0]

    setSelectedDate(formattedDate) // Met à jour selectedDate sous un format homogène
  }

  // Liste des vidéos (mémoïsée pour stabilité des dépendances)
  const videos = useMemo(
    () => [videoFile1, videoFile2, videoFile3, videoFile4, videoFile5],
    []
  )
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const videoRef = useRef(null)
  const [autoplayFailed, setAutoplayFailed] = useState(false)

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex + 1 < videos.length ? prevIndex + 1 : 0
    ) // Passe à la vidéo suivante ou revient à la première
  }

  // Tente de lire la vidéo au chargement et à chaque changement de source
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const tryPlay = () => {
      setAutoplayFailed(false)
      const p = v.play()
      if (p && typeof p.catch === "function") {
        p.catch(() => setAutoplayFailed(true))
      }
    }
    // Si la vidéo est déjà prête
    if (v.readyState >= 2) {
      tryPlay()
    } else {
      const onCanPlay = () => tryPlay()
      v.addEventListener("canplay", onCanPlay, { once: true })
      return () => v.removeEventListener("canplay", onCanPlay)
    }
  }, [currentVideoIndex, videos])

  return (
    <div>
      <NavBar className="NavBarHome" />

      <div className="home">
        {/* Section d'introduction */}
        <section className="section-intro">
          <div className="video-wrapper">
            <video
              ref={videoRef}
              src={videos[currentVideoIndex]}
              autoPlay
              loop={false} // Désactive la boucle pour utiliser l'enchaînement
              muted
              playsInline
              className="video-background"
              onEnded={handleVideoEnd} // Passe à la vidéo suivante lorsque la vidéo se termine
              onLoadedMetadata={() => {
                const v = videoRef.current
                if (!v) return
                const p = v.play()
                if (p && typeof p.catch === "function") p.catch(() => setAutoplayFailed(true))
              }}
            >
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
            {autoplayFailed && (
              <button
                className="tap-to-play"
                onClick={() => {
                  const v = videoRef.current
                  if (!v) return
                  v.play().then(() => setAutoplayFailed(false)).catch(() => setAutoplayFailed(true))
                }}
              >
                Toucher pour démarrer la vidéo
              </button>
            )}
            <div className="overlay">
              <h1>
                <img src={logoArpenteur} alt="Jeux de rôle" />
                l'Association de jeux de rôle qui te fait oublier Netflix
              </h1>
            </div>
          </div>
        </section>

        {/* Section : C'est quoi le jeu de rôle ? */}
        <section className="section-presentation">
          <div className="intro-text">
            <h3>
              Bienvenue, <br />
              Les Arpenteurs d’Abrasia sont une association qui organise des
              parties de jeu de rôle sur table. Nous jouons principalement (mais
              pas que) dans un univers fantastique nommé Abrasia, et tout le
              monde est bienvenu·e, néophytes ou vétérans, pour créer des
              moments conviviaux de rires et d’aventures !
            </h3>
          </div>
          {/* Bouton pour découvrir l'association */}
          <div className="cta">
            <button>Découvrir l'asso</button>
          </div>
        </section>

        {/* Section : Notre association */}
        <section className="section-our-association">
          <div className="divImageSectionAsso">
            <img
              src={Image1}
              alt="imageSectionAsso"
              className="imageSectionAssociation"
            />
          </div>

          <div className="section-what-is-jdr1">
            <h2>Notre association</h2>
            <p>
              L'association des Arpenteurs d'Abrasia (AA) a une double vocation
              ludique et culturelle. Elle a pour objet de réunir des joueurs et
              joueuses de façon régulière autour de tables de jeu de rôle (jdr)
              afin de partager des moments conviviaux et inclusifs. Elle se
              donne pour mission de créer du lien social, d'une part en créant
              des espaces de jeu mixtes et bienveillants pour toute personne
              souhaitant la rejoindre, d'autre part en allant vers des publics
              en recherche de sociabilité et/ou isolés.
            </p>
          </div>
        </section>

        {/* Section : Notre Agenda */}
        <section className="section-agenda">
          <h2>Notre Agenda</h2>
          <p>Rejoins une de nos parties ou viens découvrir l'association.</p>
          <Calendar onDateSelect={handleDateSelect} />
          <GameList selectedDate={selectedDate} />
        </section>

        {/* Section : Team */}
        <section className="section-team">
          <h2>Notre Équipe</h2>
          <p>Voici la team de l'association</p>
          <button>Découvrir toute la team</button>
        </section>
        <div className="section-HelloAsso">
          <h2>Nous soutenir sur HelloAsso</h2>
          <div className="boxHelloAsso">
            <div className="helloAsso1">
              <img
                src={iNeedYou}
                alt="imageSectionAsso"
                className="imageSectionAssociation"
              />
              <p>Parceque donner c'est bien, mais a nous c'est mieux.</p>
            </div>
            <div className="helloAsso2">
              <a
                href="https://www.helloasso.com/associations/les-arpenteurs-d-abrasia"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-icon contact-icon-helloasso"
                title="HelloAsso"
              ></a>
            </div>
          </div>
        </div>
        {/* Section : Nous contacter */}
        <section className="section-contact">
          <h2>Nous contacter</h2>
          <p>
            Pour nous contacter, rien de plus simple : clique sur le média de
            ton choix
          </p>

          <div className="contact-links">
            {/* Nos amis */}
            <div className="contact-section">
              <h3>Nos amis</h3>
              {/* <p>Liens vers d’autres associations du 04 :</p> */}
              <ul>
                <li>
                  <a
                    href="http://lien-vers-espace-de-jeu"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    L’Espace de Jeu
                  </a>
                </li>
                <li>
                  <a
                    href="http://lien-vers-ece-malijai"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ECE de Malijai
                  </a>
                </li>
              </ul>
            </div>

            {/* Partenaires */}
            <div className="contact-section">
              <h3>Partenaires</h3>
              {/* <p>Liens vers les sites de nos partenaires :</p> */}
              <ul>
                <li>
                  <a
                    href="http://lien-vers-theatre-durance"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Théâtre Durance
                  </a>
                </li>
                <li>
                  <a
                    href="http://lien-vers-librairie"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Librairie [Nom]
                  </a>
                </li>
                <li>
                  <a
                    href="http://lien-vers-mediatheque"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Médiathèque [Nom]
                  </a>
                </li>
              </ul>
            </div>

            {/* Abrasia */}
            <div className="contact-section">
              <h3>Découvrez l'univers d'Abrasia sur World Anvil</h3>
              {/* <p>Découvrez l'univers d'Abrasia sur World Anvil :</p> */}
              <a
                href="http://lien-vers-worldanvil-abrasia"
                target="_blank"
                rel="noopener noreferrer"
              >
                Lien vers Abrasia
              </a>
            </div>

            {/* Payer sa cotisation */}

            {/* Nous rejoindre sur */}
            <div className="contact-section">
              <h3>Nous rejoindre sur :</h3>
              <div className="social-icons">
                <a
                  href="https://discord.gg/Vv3Fa4DwYK"
                  className="contact-icon contact-icon-discord"
                  title="Discord"
                  target="_blank"
                  rel="noopener noreferrer"
                />
                <a
                  href="https://www.facebook.com/arpenteurs.abrasia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-icon contact-icon-facebook"
                  title="Facebook"
                />
                <a
                  href="mailto:arpenteurs.jdr@gmail.com"
                  className="contact-icon contact-icon-mail"
                  title="E-mail"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
