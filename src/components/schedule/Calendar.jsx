import React, { useState, useEffect } from "react"
import axios from "axios"
import "./Calendar.scss"
import ArrowLeftCal from "../../assets/pics/arrow-circle-left-svgrepo-com.svg"
import ArrowRightCal from "../../assets/pics/arrow-circle-right-svgrepo-com.svg"

export default function Calendar({ onDateSelect }) {
  const token = localStorage.getItem("authToken")
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [calendarDays, setCalendarDays] = useState([])
  const [partieExiste, setPartieExiste] = useState([])
  const [selectedDateCalendar, setselectedDateCalendar] = useState(new Date())
  console.info("selectedDateCalendar", selectedDateCalendar)
  const headers = {
    Authorization: `Bearer ${token}`,
  }

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/parties/affichage`, { headers })
      .then((res) => {
        setPartieExiste(res.data)
      })
      .catch((err) => {
        console.error("Problème lors du chargement des parties", err)
      })
  }, [])

  useEffect(() => {
    generateCalendarDays(selectedYear, selectedMonth)
  }, [selectedMonth, selectedYear])

  const leftArrowClick = () => {
    const newMonth = selectedMonth === 0 ? 11 : selectedMonth - 1
    const newYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear

    setSelectedMonth(newMonth)
    setSelectedYear(newYear)
  }

  const rightArrowClick = () => {
    const newMonth = selectedMonth === 11 ? 0 : selectedMonth + 1
    const newYear = selectedMonth === 11 ? selectedYear + 1 : selectedYear

    setSelectedMonth(newMonth)
    setSelectedYear(newYear)
  }

  const monthChange = (e) => {
    const newMonth = parseInt(e.target.value)

    setSelectedMonth(newMonth)
  }

  const yearChange = (e) => {
    const newYear = parseInt(e.target.value)

    setSelectedYear(newYear)
  }

  const generateCalendarDays = (year, month) => {
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfWeek = new Date(year, month, 1).getDay()
    const days = []

    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    let startDay = firstDayOfWeek - 1
    if (startDay < 0) {
      startDay = 6
    }

    for (let i = startDay; i > 0; i--) {
      const previousDate = new Date(year, month, 1 - i)
      days.push({ day: null, isToday: false, date: previousDate })
    }

    for (let i = 1; i <= totalDaysInMonth; i++) {
      const currentDate = new Date(year, month, i)
      const isToday =
        currentDate.getDate() === today.getDate() &&
        currentDate.getMonth() === currentMonth &&
        currentDate.getFullYear() === currentYear
      days.push({ day: i, isToday, date: currentDate })
    }

    setCalendarDays(days)
  }

  const goToToday = () => {
    const today = new Date()

    setSelectedMonth(today.getMonth())
    setSelectedYear(today.getFullYear())
  }

  const handleDateClick = (date) => {
    if (date instanceof Date) {
      const adjustedDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      )

      setselectedDateCalendar(adjustedDate.toISOString().split("T")[0])
      onDateSelect(adjustedDate)
    } else {
      console.warn("Invalid date clicked:", date)
    }
  }

  return (
    <div className="calendar-container">
      <div className="calendar-month-arrow-container">
        <div className="calendar-month-year-container">
          <select
            className="calendar-years"
            onChange={yearChange}
            value={selectedYear}
          >
            {Array.from({ length: 121 }, (_, i) => (
              <option key={i} value={selectedYear - 60 + i}>
                {selectedYear - 60 + i}
              </option>
            ))}
          </select>
          <select
            className="calendar-months"
            onChange={monthChange}
            value={selectedMonth}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(2000, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
        <div className="calendar-arrow-container">
          <button className="calendar-today-button" onClick={goToToday}>
            Aujourd'hui
          </button>
          <div>
            <img
              src={ArrowLeftCal}
              alt="Left arrow"
              className="calendarLeft-arrow"
              onClick={leftArrowClick}
            />
          </div>
          <div>
            <img
              src={ArrowRightCal}
              alt="Right arrow"
              className="calendarLeft-arrow"
              onClick={rightArrowClick}
            />
          </div>
        </div>
      </div>
      <ul className="calendar-week">
        <li>Lun</li>
        <li>Mar</li>
        <li>Mer</li>
        <li>Jeu</li>
        <li>Ven</li>
        <li>Sam</li>
        <li>Dim</li>
      </ul>
      <ul className="calendar-days">
        {calendarDays.map((dayInfo, index) => (
          <li
            key={index}
            className={
              dayInfo.day
                ? "calendar-day" +
                  (dayInfo.isToday ? " current-day" : "") +
                  (dayInfo.date &&
                  partieExiste.find((partie) => {
                    const partieDate = new Date(partie.date)
                    return (
                      partieDate.getFullYear() === dayInfo.date.getFullYear() &&
                      partieDate.getMonth() === dayInfo.date.getMonth() &&
                      partieDate.getDate() === dayInfo.date.getDate()
                    )
                  })
                    ? " has-event"
                    : "")
                : "calendar-day empty"
            }
            onClick={() => handleDateClick(dayInfo.date)}
          >
            {dayInfo.day}
          </li>
        ))}
      </ul>
    </div>
  )
}
