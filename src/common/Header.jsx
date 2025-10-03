import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHelmetSafety,
  faUserCircle,
  faCaretDown,
  faIdBadge,
  faSignOutAlt,
  faSignInAlt,
  faUserPlus,
  
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import authAPI from "../services/api";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Close dropdown 
  useEffect(() => {
    setDropdownOpen(false);
  }, [location]);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  // Logout confirmation
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        authAPI.clearToken();
        Swal.fire("Logged out!", "You have been logged out successfully.", "success");
        navigate("/login");
      }
    });
  };

  // Admin Navigation Links
  const adminLinks = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/projects", label: "Projects" },
    { to: "/admin/equipment", label: "Equipment" },
    { to: "/admin/incidents", label: "Incidents" },
    { to: "/admin/hazards", label: "Hazards" },
    { to: "/admin/gearlogs", label: "Gear Logs" },
  ];

  // User Navigation Links
  const userLinks = [
    { to: "/dashboard", label: "Dashboard"},
    { to: "/projects", label: "Projects"},
    { to: "/recommendations", label: "Recommendations" },
  ];


  const navLinks = user?.role === "Admin" ? adminLinks : userLinks;

  return (
    <header className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Link to={user?.role === "Admin" ? "/admin/dashboard" : "/dashboard"} className="logo-link">
          <FontAwesomeIcon icon={faHelmetSafety} className="logo-icon" />
          <span className="logo-text">Site Safety Monitor</span>
        </Link>
      </div>

      {/*  Navigation Links */}
      <nav className="navbar-links">
        {user &&
          navLinks.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FontAwesomeIcon icon={icon} className="nav-icon" /> {label}
            </NavLink>
          ))}
      </nav>

      {/* User Dropdown */}
      <div className="navbar-user">
        <button
          className="dropdown-toggle"
          onClick={toggleDropdown}
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
        >
          <FontAwesomeIcon icon={faUserCircle} className="user-icon" />
          <span className="user-name">{user?.name || "Account"}</span>
          <FontAwesomeIcon icon={faCaretDown} className="caret-icon" />
        </button>

        {dropdownOpen && (
          <div className="dropdown-menu" role="menu">
            {user ? (
              <>
                <div className="dropdown-header">
                  <strong>{user?.email }</strong>
                </div>
                <Link to="/profile" className="dropdown-item" role="menuitem">
                  <FontAwesomeIcon icon={faIdBadge} /> Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="dropdown-item logout-btn"
                  role="menuitem"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="dropdown-item" role="menuitem">
                  <FontAwesomeIcon icon={faSignInAlt} /> Login
                </Link>
                <Link to="/register" className="dropdown-item" role="menuitem">
                  <FontAwesomeIcon icon={faUserPlus} /> Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
