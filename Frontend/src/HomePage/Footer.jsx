import React from 'react';
import '../CSS/Footer.css';
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa'; // Importing icons
import { Link } from 'react-router-dom';
import  { useEffect } from 'react';

const Footer = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on component mount
}, []);

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="about-section">
          <h2>About Your Wheels</h2>
          <p>
            Welcome to Your Wheels, where we're committed to simplifying your vehicle selection process.
            Utilizing advanced algorithms, we recommend vehicles tailored to your priorities, whether it's 
            fuel efficiency, safety, or performance. Explore the latest trends and future innovations in 
            the automotive industry, along with rental vehicles for your short-term needs. Join our community 
            and navigate the world of automobiles with confidence and ease.
          </p>
          <h2 style={{marginTop:"20px"}}>FAQs</h2>
          <br />
          <Link to="/faq" className='faq-link'>Click here for the frequently aksed questions</Link>
        </div>

        <div className="contact-section">
          <h2>Contact Us</h2>
          <p>Thank you for considering Your Wheels for your vehicle recommendations and rental needs! 
            For inquiries, feel free to reach out:</p>
          <a href="mailto:yourwheels@gmail.com">yourwheels@gmail.com</a>
          <p>Phone: +91 9876543210</p>
          <div className="social-icons">
            <a href="https://www.instagram.com" className="icon" aria-label="Instagram" target="_blank">
              <FaInstagram />
            </a>
            <a href="https://www.facebook.com" className="icon" aria-label="Facebook"  target="_blank">
              <FaFacebookF />
            </a>
            <a href="https://www.twitter.com" className="icon" aria-label="X (formerly Twitter)" target="_blank">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom" style={{textAlign: "center"}}>
        <p>© 2024 Your Wheels. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
