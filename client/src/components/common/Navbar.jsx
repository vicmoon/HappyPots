import { Link } from 'react-router-dom';
import '../../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🪴 Happy Pot
        </Link>
        <div className="navbar-links">
          <Link to="/library" className="nav-link">
            Browse Plants
          </Link>
          <Link to="/login" className="nav-link">
            Login
          </Link>
          <Link to="/register" className="nav-link">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
