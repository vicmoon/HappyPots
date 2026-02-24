// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import '../../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Happy Pot
      </Link>
      <div className="nav-links">
        <Link to="/library">Browse Plants</Link>
        {user ? (
          <>
            <Link to="/my-garden">My Garden</Link>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
