import React, { useState, useEffect } from "react"
import "./Carrousel.scss"

const Carrousel = ({ images, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const length = images.length

  // Gestion de la transition automatique du carrousel
  useEffect(() => {
    const autoSlide = setInterval(() => {
      nextSlide()
    }, interval)

    // Nettoyer l'intervalle lors du démontage du composant
    return () => clearInterval(autoSlide)
  }, [currentIndex])

  // Passer à la slide suivante
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % length)
  }

  // Revenir à la slide précédente
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? length - 1 : prevIndex - 1
    )
  }

  // Rendu du composant
  return (
    <div className="carrousel">
      <button className="prev" onClick={prevSlide}>
        &#10094;
      </button>

      <div className="carrousel-content">
        {images.map((image, index) => (
          <div
            key={index}
            className={index === currentIndex ? "slide active" : "slide"}
          >
            {index === currentIndex && (
              <img src={image} alt={`slide-${index}`} className="image" />
            )}
          </div>
        ))}
      </div>

      <button className="next" onClick={nextSlide}>
        &#10095;
      </button>
    </div>
  )
}

export default Carrousel
