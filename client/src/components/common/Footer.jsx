import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <p>
        &copy; {new Date().getFullYear()} HappyPot 🪴 by Victoria. All rights
        reserved.
      </p>
    </footer>
  );
};

export default Footer;
