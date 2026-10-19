import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ConfirmModal from './ConfirmModal';

const Navbar: React.FC = () => {
  const { logout, user } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => setShowLogoutConfirm(true);
  const confirmLogout = () => { setShowLogoutConfirm(false); logout(); };

  const isActive = (path: string) => location.pathname === path;

  // Close mobile menu when route changes
  useEffect(() => {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      const bsCollapse = new (window as any).bootstrap.Collapse(navbarCollapse, {
        toggle: false
      });
      bsCollapse.hide();
    }
  }, [location]);

  return (
    <>
    <nav className="app-navbar navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-journal-text me-2"></i>
          Notes App
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                to="/"
              >
                <i className="bi bi-house me-1"></i>
                Dashboard
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav align-items-lg-center">
            {/* Theme Toggle */}
            <li className="nav-item me-lg-2">
              <button
                className="theme-toggle-btn"
                onClick={toggleTheme}
                title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                type="button"
              >
                <i className={`bi bi-${isDark ? 'sun' : 'moon'}-fill`} aria-hidden="true"></i>
                <span>{isDark ? 'Light' : 'Dark'}</span>
              </button>
            </li>

            {/* User dropdown */}
            <li className="nav-item dropdown">
              <button
                className="user-profile-btn dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                id="navbarDropdown"
              >
                <i className="bi bi-person-circle" aria-hidden="true"></i>
                <span>Lochan</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                {/* Identity block */}
                <li>
                  <div className="dropdown-item-text py-2 px-3">
                    <div className="fw-semibold" style={{ fontSize: '0.95rem' }}>Lochan T N</div>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>@lochan387</div>
                  </div>
                </li>
                <li><hr className="dropdown-divider my-1" /></li>
                <li>
                  <div className="dropdown-item-text">
                    <small className="text-muted">
                      Last login: {user?.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : 'Unknown'}
                    </small>
                  </div>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <ConfirmModal
      show={showLogoutConfirm}
      title="Logout"
      message="Are you sure you want to logout?"
      confirmLabel="Logout"
      confirmVariant="warning"
      onConfirm={confirmLogout}
      onCancel={() => setShowLogoutConfirm(false)}
    />
  </>
  );
};

export default Navbar;
