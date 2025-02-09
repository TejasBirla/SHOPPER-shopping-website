import React from 'react'
import "./Navbar.css";
import navlogo from "../../assets/nav-logo.svg"
import navprofile from "../../assets/nav-profile.svg"

export default function Navbar() {
  return (
      <div className="navbar">
          <img src={navlogo} className='nav-logo'/>
          <img src={navprofile} className='nav-profile'/>
    </div>
  )
}
