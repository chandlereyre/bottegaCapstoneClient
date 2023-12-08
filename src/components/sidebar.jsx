import { React, useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../assets/chat.png";

export default function Sidebar({ handleSuccessfulLogout }) {
  const [navMenu, setNavMenu] = useState(false);

  function handleLogout() {
    handleSuccessfulLogout();
  }

  function toggleNavMenu() {
    setNavMenu(!navMenu);
  }

  return (
    <div>
      <div className="sidebar">
        <div id="sidebar-logo">
          <img src={logo}></img>
        </div>
        <div className="icons">
          <NavLink to="/home" className="icon">
            <FontAwesomeIcon icon="fa-solid fa-comment" className="fa-icon" />
          </NavLink>
          <NavLink to="/profile" className="icon">
            <FontAwesomeIcon icon="fa-solid fa-user" className="fa-icon" />
          </NavLink>
        </div>
        <div id="sidebar-logout" className="icon">
          <FontAwesomeIcon
            icon="fa-solid fa-right-from-bracket"
            onClick={handleLogout}
          />
        </div>
        <div className="sidebar-navigation" onClick={toggleNavMenu}>
          <FontAwesomeIcon icon="fa-solid fa-bars" className="icon" />
        </div>
      </div>
      {navMenu ? (
        <div className="sidebar-nav-menu">
          <NavLink
            to="/home"
            className="sidebar-nav-link"
            onClick={toggleNavMenu}
          >
            Home
          </NavLink>
          <NavLink
            to="/profile"
            className="sidebar-nav-link"
            onClick={toggleNavMenu}
          >
            Profile
          </NavLink>
          <a
            className="sidebar-nav-link"
            id="sidebar-nav-link-logout"
            onClick={handleLogout}
          >
            Logout
          </a>
        </div>
      ) : null}
    </div>
  );
}
