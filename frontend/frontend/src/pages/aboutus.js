import React from 'react';
import './aboutus'; // Ensure this file is correctly named and linked

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div class="centering-container">
  <h1 class="about-us-title">About Us</h1>
</div>
      <p className="section-text">
        Welcome to <strong>MOODA</strong>! We're a fashion assistant platform created to simplify your wardrobe decisions while promoting sustainability. 
        Our mission is to help you create personalized outfits, plan for events, and make the most out of your closet, all while reducing fashion waste. 
        Powered by AI, we’re here to help you make smarter choices about fashion and style.
      </p>

      {/* Mission, Vision, and Values in One Line */}
      <div className="mission-vision-values">
        <section className="section mission">
          <h2 className="section-title">Our Mission</h2>
          <p className="section">
            Our mission is to revolutionize the way you approach fashion by offering personalized styling recommendations and a virtual wardrobe that helps reduce clothing waste. 
            We empower you to make smarter fashion decisions, plan your outfits effortlessly, and explore endless styling possibilities.
          </p>
        </section>

        <section className="section vision">
          <h2 className="section-title">Our Vision</h2>
          <p className="section">
            We envision a world where everyone can express their unique style while contributing to a more sustainable future. 
            By leveraging AI, we aim to make fashion more accessible, personalized, and environmentally responsible.
          </p>
        </section>

        <section className="section values">
          <h2 className="section-title">Our Values</h2>
          <ul className="about-us-ul">
            <li><strong>Sustainability:</strong> We care about the environment and encourage mindful consumption of clothing to reduce waste.</li>
            <li><strong>Personalization:</strong> Our platform offers tailored recommendations to help you create outfits that reflect your unique style.</li>
            <li><strong>Innovation:</strong> We embrace cutting-edge AI technology to deliver smarter, more efficient fashion solutions.</li>
            <li><strong>Empowerment:</strong> We aim to make you feel confident in your wardrobe choices by providing valuable tools and insights.</li>
          </ul>
        </section>
      </div>

      <section className="section team">
        <h2 className="section-title">Meet Our Team</h2>
        <p className="section-text">
          We are a diverse team of fashion enthusiasts, tech innovators, and sustainability advocates, working together to create a platform that makes fashion smarter and more sustainable.
        </p>
        <div className="team-members">
          <div className="team-member">
            <h3>NOUR GHALAYINI</h3>
            <p>Co-Founder & CEO</p>
          </div>
          <div className="team-member">
            <h3>JOELLE JIBAI</h3>
            <p>Co-Founder & CEO</p>
          </div>
        </div>
      </section>

      <section className="section contact">
        <h2 className="section-title">Get in Touch</h2>
        <p className="section">
          If you want to learn more about our platform, have suggestions, or want to collaborate with us, feel free to reach out!
        </p>
        <ul className="about-us-ul">
          <li>Email: <a href="mailto:contact@smartcloset.com">contact@smartcloset.com</a></li>
          <li>Follow us on Instagram: <a href="https://instagram.com/smartcloset">instagram.com/smartcloset</a></li>
          <li>Join us on LinkedIn: <a href="https://linkedin.com/company/smartcloset">linkedin.com/company/smartcloset</a></li>
        </ul>
      </section>
    </div>
  );
};

export default AboutUs;
