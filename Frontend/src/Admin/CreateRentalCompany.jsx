import React, { useState,useEffect } from "react";
import "../CSS/BuyerLogin.css";  // Updated CSS reference
import NavBar from '../NavBar.jsx';
import { useNavigate } from 'react-router-dom';

export default function RentalCompanySignUp() {
  const [signUpForm, setSignUpForm] = useState({
    rental_company_username: "",
    rental_company_email: "",
    rental_company_password: "",
  });

  const [signUpErrors, setSignUpErrors] = useState({
    rental_company_username: "",
    rental_company_email: "",
    rental_company_password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin-login');
    }
  }, [navigate]);

  // Validate Sign Up
  const validateSignUp = () => {
    let isValid = true;
    const errors = { rental_company_username: "", rental_company_email: "", rental_company_password: "" };

    if (!signUpForm.rental_company_username.trim()) {
      isValid = false;
      errors.rental_company_username = "Username is required";
    }

    if (!signUpForm.rental_company_email.trim()) {
      isValid = false;
      errors.rental_company_email = "Email is required";
    }

    if (!signUpForm.rental_company_password.trim()) {
      isValid = false;
      errors.rental_company_password = "Password is required";
    }

    setSignUpErrors(errors);
    return isValid;
  };

  // Handle Sign Up form submission
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (validateSignUp()) {
      try {
        const response = await fetch('http://localhost:5000/create-rental-company', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signUpForm),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        alert('Rental Company Sign-up successful!');
        console.log(data);
        setSignUpForm({ rental_company_username: "", rental_company_email: "", rental_company_password: "" });
        navigate('/rental-company-data');
      } catch (error) {
        console.error('Error:', error);
        alert('Error signing up.');
      }
    }
  };

  // Update form state for sign-up
  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <NavBar />
      <div className="login-page">
        <div className="container">
          <div className="forms-container">
            <div className="signin-signup">
              {/* Sign Up Form */}
              <form onSubmit={handleSignUpSubmit} className="sign-in-form">
                <h2 className="title">Creating a Rental Company User</h2>

                <div className="input-field">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    placeholder="Username"
                    name="rental_company_username"
                    value={signUpForm.rental_company_username}
                    onChange={handleSignUpChange}
                  />
                </div>
                <span className="error-message">{signUpErrors.rental_company_username}</span>

                <div className="input-field">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    placeholder="Email"
                    name="rental_company_email"
                    value={signUpForm.rental_company_email}
                    onChange={handleSignUpChange}
                  />
                </div>
                <span className="error-message">{signUpErrors.rental_company_email}</span>

                <div className="input-field">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    placeholder="Password"
                    name="rental_company_password"
                    value={signUpForm.rental_company_password}
                    onChange={handleSignUpChange}
                  />
                </div>
                <span className="error-message">{signUpErrors.rental_company_password}</span>

                <input type="submit" value="Sign Up" className="btn solid" />
                <p className="social-text">Or sign up with social platforms</p>
                <div className="social-media">
                  <a href="#" className="social-icon">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="social-icon">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="social-icon">
                    <i className="fab fa-google"></i>
                  </a>
                  <a href="#" className="social-icon">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </form>
            </div>
          </div>

          {/* Panels */}
          <div className="panels-container">
            <div className="panel left-panel">
              <div className="content" style={{ marginRight: "100px" }}>
                <h3 style={{ width: "500px", marginLeft: "200px" }}>Rental Company user will be created here</h3>
                <p>Rental Company can add vehicles to rent</p>
              </div>
              <img src="img/register.svg" className="image" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
