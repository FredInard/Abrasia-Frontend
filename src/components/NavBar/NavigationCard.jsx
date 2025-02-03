import React from "react"
import { useNavigate } from "react-router-dom"
import "./NavigationCard.scss"

const NavigationCard = () => {
  const navigate = useNavigate()

  return (
    <div className="navigation-card">
      {/* Accueil */}
      <div className="tab" onClick={() => navigate("/")}>
        <svg
          className="svgIcon"
          viewBox="0 0 104 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100.5 40.75V96.5H66V68.5V65H62.5H43H39.5V68.5V96.5H3.5V40.75L52 4.375L100.5 40.75Z"
            stroke="black"
            strokeWidth="7"
          ></path>
        </svg>
      </div>

      {/* Créer Partie */}
      <div className="tab" onClick={() => navigate("/creer-partie")}>
        <svg
          width="104"
          height="100"
          viewBox="0 0 104 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="21.5"
            y="3.5"
            width="60"
            height="60"
            rx="30"
            stroke="black"
            strokeWidth="7"
          ></rect>
          <g clipPath="url(#clip0_41_27)">
            <mask
              id="mask0_41_27"
              style={{ maskType: "luminance" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="61"
              width="104"
              height="52"
            >
              <path
                d="M0 113C0 84.2812 23.4071 61 52.1259 61C80.706 61 104 84.4199 104 113H0Z"
                fill="white"
              ></path>
            </mask>
            <g mask="url(#mask0_41_27)">
              <path
                d="M-7 113C-7 80.4152 19.4152 54 52 54H52.2512C84.6973 54 111 80.3027 111 112.749H97C97 88.0347 76.9653 68 52.2512 68H52C27.1472 68 7 88.1472 7 113H-7ZM-7 113C-7 80.4152 19.4152 54 52 54V68C27.1472 68 7 88.1472 7 113H-7ZM52.2512 54C84.6973 54 111 80.3027 111 112.749V113H97V112.749C97 88.0347 76.9653 68 52.2512 68V54Z"
                fill="black"
              ></path>
            </g>
          </g>
          <defs>
            <clipPath id="clip0_41_27">
              <rect
                width="104"
                height="39"
                fill="white"
                transform="translate(0 61)"
              ></rect>
            </clipPath>
          </defs>
        </svg>
      </div>

      {/* Administration */}
      <div className="tab" onClick={() => navigate("/admin")}>
        <svg
          width="101"
          height="114"
          viewBox="0 0 101 114"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="46.1726"
            cy="46.1727"
            r="29.5497"
            transform="rotate(36.0692 46.1726 46.1727)"
            stroke="black"
            strokeWidth="7"
          ></circle>
          <line
            x1="61.7089"
            y1="67.7837"
            x2="97.7088"
            y2="111.784"
            stroke="black"
            strokeWidth="7"
          ></line>
        </svg>
      </div>
    </div>
  )
}

export default NavigationCard
