import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Calendar.scss";
import ArrowLeftCal from "../../assets/pics/arrow-circle-left-svgrepo-com.svg";
import ArrowRightCal from "../../assets/pics/arrow-circle-right-svgrepo-com.svg";

export default function Calendar({ onDateSelect }) {
  const token = localStorage.getItem("authToken");

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [calendarDays, setCalendarDays] = useState([]);
  const [partieExiste, setPartieExiste] = useState([]);
  const [selectedDateCalendar, setSelectedDateCalendar] = useState(new Date());

  console.info("📆 Selected Date:", selectedDateCalendar);

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // 🔹 Récupération des parties depuis l'API
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/parties/affichage`, { headers })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setPartieExiste(res.data);
        } else {
          console.warn("⚠️ L'API n'a pas renvoyé un tableau :", res.data);
          setPartieExiste([]);
        }
      })
      .catch((err) => console.error("❌ Erreur lors du chargement des parties:", err));
  }, []);

  // 🔹 Génération du calendrier
  useEffect(() => {
    generateCalendarDays(selectedYear, selectedMonth);
  }, [selectedMonth, selectedYear]);

  // 🔹 Fonction pour générer les jours du calendrier
  const generateCalendarDays = useCallback((year, month) => {
    console.info(`📅 Génération du calendrier pour ${month + 1}/${year}`);

    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const days = [];

    const today = new Date();
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

    let startDay = (firstDayOfWeek - 1 + 7) % 7; // Corrige le décalage pour commencer le lundi

    // 🔹 Ajout des jours du mois précédent
    for (let i = startDay; i > 0; i--) {
      const previousDate = new Date(year, month, 1 - i);
      days.push({ day: null, isToday: false, date: previousDate });
    }

    // 🔹 Ajout des jours du mois courant
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      days.push({
        day: i,
        isToday: isCurrentMonth && today.getDate() === i,
        date: currentDate,
      });
    }

    setCalendarDays(days);
  }, []);

  // 🔹 Changement de mois et d'année
  const changeMonth = (offset) => {
    setSelectedMonth((prevMonth) => (prevMonth + offset + 12) % 12);
    setSelectedYear((prevYear) => prevYear + (selectedMonth === 0 && offset === -1 ? -1 : selectedMonth === 11 && offset === 1 ? 1 : 0));
  };

  const goToToday = () => {
    const today = new Date();
    setSelectedMonth(today.getMonth());
    setSelectedYear(today.getFullYear());
  };

  // 🔹 Gestion du clic sur une date
  const handleDateClick = (date) => {
    if (!(date instanceof Date)) {
      console.warn("⚠️ Date invalide cliquée :", date);
      return;
    }

    const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    setSelectedDateCalendar(adjustedDate.toISOString().split("T")[0]);
    onDateSelect(adjustedDate);
  };

  return (
    <div className="calendar-container">
      {/* Navigation mois & année */}
      <div className="calendar-month-arrow-container">
        <div className="calendar-month-year-container">
          <select className="calendar-years" onChange={(e) => setSelectedYear(parseInt(e.target.value))} value={selectedYear}>
            {Array.from({ length: 121 }, (_, i) => (
              <option key={i} value={selectedYear - 60 + i}>
                {selectedYear - 60 + i}
              </option>
            ))}
          </select>

          <select className="calendar-months" onChange={(e) => setSelectedMonth(parseInt(e.target.value))} value={selectedMonth}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(2000, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>

        {/* Flèches de navigation */}
        <div className="calendar-arrow-container">
          <button className="calendar-today-button" onClick={goToToday}>
            Aujourd'hui
          </button>
          <img src={ArrowLeftCal} alt="Mois précédent" className="calendar-arrow" onClick={() => changeMonth(-1)} />
          <img src={ArrowRightCal} alt="Mois suivant" className="calendar-arrow" onClick={() => changeMonth(1)} />
        </div>
      </div>

      {/* Jours de la semaine */}
      <ul className="calendar-week">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, index) => (
          <li key={index}>{day}</li>
        ))}
      </ul>

      {/* Jours du calendrier */}
      <ul className="calendar-days">
        {calendarDays.map((dayInfo, index) => {
          const hasEvent =
            Array.isArray(partieExiste) &&
            partieExiste.some((partie) => {
              const partieDate = new Date(partie.date);
              return (
                partieDate.getFullYear() === dayInfo.date.getFullYear() &&
                partieDate.getMonth() === dayInfo.date.getMonth() &&
                partieDate.getDate() === dayInfo.date.getDate()
              );
            });

          return (
            <li
              key={index}
              className={`calendar-day${dayInfo.isToday ? " current-day" : ""}${hasEvent ? " has-event" : ""}`}
              onClick={() => handleDateClick(dayInfo.date)}
            >
              {dayInfo.day}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
