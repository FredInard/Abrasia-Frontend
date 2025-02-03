// ToggleSwitch.jsx

import React from "react"
import "./ToggleSwitch.scss"

const ToggleSwitch = ({ isChecked, onChange }) => {
  return (
    <div className="toggle-switch">
      <label className="switch">
        <input type="checkbox" checked={isChecked} onChange={onChange} />
        <span className="slider round"></span>
      </label>
    </div>
  )
}

export default ToggleSwitch
