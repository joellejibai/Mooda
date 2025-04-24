import React from 'react';
import './aboutus';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="about-hero">
        <h1 className="about-title">About Us</h1>
        <p className="about-intro">
          Welcome to <span className="brand-name">MOODA</span> — your luxurious digital fashion assistant.
          We help you simplify wardrobe decisions, plan stunning outfits, and shop smarter while promoting sustainability.
        </p>
      </div>

      <div className="about-cards">
        <div className="glass-card">
          <h2>Our Mission</h2>
          <p>
            To revolutionize how you approach fashion by offering personalized recommendations
            and a virtual wardrobe that minimizes waste while maximizing your style.
          </p>
        </div>
        <div className="glass-card">
          <h2>Our Vision</h2>
          <p>
            We envision a future where every person can express their unique style confidently and sustainably,
            powered by cutting-edge technology and conscious choices.
          </p>
        </div>
        <div className="glass-card">
          <h2>Our Values</h2>
          <ul>
            <li><strong>Sustainability:</strong> Reducing fashion waste through smart outfit planning.</li>
            <li><strong>Personalization:</strong> Tailored styling based on your preferences.</li>
            <li><strong>Innovation:</strong> Leveraging ML to enhance your wardrobe decisions.</li>
            <li><strong>Empowerment:</strong> Helping you feel confident and creative with fashion.</li>
          </ul>
        </div>
      </div>

      <div className="about-team">
        <h2>Meet the Founders</h2>
        <div className="team-members">
          <div className="team-card">
            <h3>Nour Ghalayini</h3>
            <p>Co-Founder & CEO</p>
          </div>
          <div className="team-card">
            <h3>Joelle Jibai</h3>
            <p>Co-Founder & CEO</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
