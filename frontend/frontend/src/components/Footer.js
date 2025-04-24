import React from 'react';
import {
  FaEnvelope,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaFacebook,
  FaTwitter,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <h3 className="footer-logo">MOODA</h3>

        <div className="footer-icons">
          <a href="mailto:contact@smartcloset.com" className="footer-icon">
            <FaEnvelope />
          </a>
          <a href="https://www.instagram.com/moodawardrobe/" target="_blank" rel="noopener noreferrer" className="footer-icon">
            <FaInstagram />
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="footer-icon">
            <FaTiktok />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer-icon">
            <FaYoutube />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-icon">
            <FaFacebook />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-icon">
            <FaTwitter />
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Privacy Policy | Terms & Conditions | 2025 @MoodaCloset</p>
        <p>&copy; 2025 Copyright: Mooda Capstone Project</p>
      </div>
    </footer>
  );
};

export default Footer;
