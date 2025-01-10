import React, { useState } from "react";
import "../CSS/BuyerLogin.css"; // Ensure this file exists and is styled properly
import NavBar from '../NavBar.jsx';
import { useNavigate } from 'react-router-dom';

export default function RentalCompanyLogin() {
  const [signInForm, setSignInForm] = useState({
    rental_company_username: "",
    rental_company_password: "",
  });

  const [signInErrors, setSignInErrors] = useState({
    rental_company_username: "",
    rental_company_password: "",
  });

  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  // Validate Sign In
  const validateSignIn = () => {
    let isValid = true;
    const errors = { rental_company_username: "", rental_company_password: "" };

    if (!signInForm.rental_company_username.trim()) {
      isValid = false;
      errors.rental_company_username = "Username is required";
    }

    if (!signInForm.rental_company_password.trim()) {
      isValid = false;
      errors.rental_company_password = "Password is required";
    }

    setSignInErrors(errors);
    return isValid;
  };

  // Handle Sign In form submission
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (validateSignIn()) {
      try {
        const response = await fetch('http://localhost:5000/rentalcompanylogin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signInForm),
        });

        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('userType', 'rental_company');
          localStorage.setItem('rental_company_username', signInForm.rental_company_username);
          localStorage.setItem('token', data.token);
          setSignInForm({ rental_company_username: "", rental_company_password: "" }); // Clear form
          navigate('/rental-company-dashboard'); // Redirect after successful login
        } else {
          setServerError(data.message); // Display server error
        }
      } catch (err) {
        console.error('Error:', err);
        setServerError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  // Update form state
  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <NavBar />
      <div className="login-page">
        <div className="container">
          <div className="forms-container">
            <div className="signin-signup">
              {/* Sign In Form */}
              <form onSubmit={handleSignInSubmit} className="sign-in-form">
                <h2 className="title">Rental Company Login</h2>
                <div className="input-field">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    placeholder="Username"
                    name="rental_company_username"
                    value={signInForm.rental_company_username}
                    onChange={handleSignInChange}
                  />
                </div>
                <span className="error-message">{signInErrors.rental_company_username}</span>

                <div className="input-field">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    placeholder="Password"
                    name="rental_company_password"
                    value={signInForm.rental_company_password}
                    onChange={handleSignInChange}
                  />
                </div>
                <span className="error-message">{signInErrors.rental_company_password}</span>

                <input type="submit" value="Login" className="btn solid" />
                {serverError && <p className="error-message">{serverError}</p>}
              </form>
            </div>
          </div>

          {/* Panels */}
          <div className="panels-container">
            <div className="panel left-panel">
              <div className="content" style={{ marginRight: "100px" }}>
                <h3>How to create a Rental Company User?</h3>
                <p>Contact yourwheels123@gmail.com or +91 9876543210 for rental company account creation</p>
              </div>
              <img src="log.svg" className="image" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}