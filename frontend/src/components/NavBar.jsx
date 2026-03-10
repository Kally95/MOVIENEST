import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

import Button from "./Button";
import Modal from "./Modal";
import SearchModal from "./SearchModal";

import "./Navbar.css";

export default function Navbar({ isAuthed, logout }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="navbar-header">
      <nav className="navbar" aria-label="Main Navigation">
        <div className="navbar-wrapper">
          <Link to="/" className="navbar-logo">
            MOVIENEST
          </Link>

          <div className="navbar-right">
            <ul className="navbar-links">
              <li>
                <button
                  type="button"
                  onClick={() => setIsOpen(true)}
                  className="search-icon"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </button>
              </li>

              {isAuthed && (
                <li>
                  <NavLink
                    to="/lists"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    Lists
                  </NavLink>
                </li>
              )}

              {isAuthed && (
                <li>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    Profile
                  </NavLink>
                </li>
              )}

              {!isAuthed && (
                <li>
                  <NavLink to="/login">Login</NavLink>
                </li>
              )}

              {!isAuthed && (
                <li>
                  <NavLink to="/register" className="signup-btn">
                    Register
                  </NavLink>
                </li>
              )}
            </ul>

            {isAuthed && (
              <div className="navbar-actions">
                <Button onClick={logout}>Logout</Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <SearchModal setIsOpen={setIsOpen} />
      </Modal>
    </header>
  );
}
