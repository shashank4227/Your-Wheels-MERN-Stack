import React, { useState,useEffect } from "react";
import "../CSS/BuyerLogin.css"; // Ensure this CSS file exists and is styled properly
import NavBar from '../NavBar.jsx';
import { useNavigate } from 'react-router-dom';

export default function AddCompanyByAdmin() {


  const [isSignUpMode, setIsSignUpMode] = useState(true); // Initialize in sign-up mode
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin-login');
    }
  }, [navigate]);

  // Form states
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

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Success message state
  const [successMessage, setSuccessMessage] = useState("");

  // Validate Sign Up
  const validateSignUp = () => {
    let isValid = true;
    const errors = { rental_company_username: "", rental_company_email: "", rental_company_password: "" };

    // Username validation
    const username = signUpForm.rental_company_username.trim();
    const usernameFirstCharPattern = /^[A-Za-z]/; // Ensures the first character is a letter

  // Enhanced Username Validation
if (!username) {
  isValid = false;
  errors.rental_company_username = "Username is required";
} else if (!usernameFirstCharPattern.test(username)) {
  isValid = false;
  errors.rental_company_username = "Username must start with an alphabetic letter";
} else if (username.length < 3) {
  isValid = false;
  errors.rental_company_username = "Username must be at least 3 characters long";
} else if (username.length > 15) {
  isValid = false;
  errors.rental_company_username = "Username must be no longer than 15 characters";
} else if (!/^[A-Za-z0-9_]+$/.test(username)) {
  // Ensure username contains only letters, numbers, and underscores
  isValid = false;
  errors.rental_company_username = "Username can only contain letters, numbers, and underscores";
} else if (/^(admin|root|superuser)$/i.test(username)) {
  // Avoid reserved words like "admin", "root", or "superuser"
  isValid = false;
  errors.rental_company_username = "Username cannot be a reserved word like 'admin', 'root', or 'superuser'";
}


    // Email validation
    const email = signUpForm.rental_company_email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      isValid = false;
      errors.rental_company_email = "Email is required";
    } else if (!emailRegex.test(email)) {
      isValid = false;
      errors.rental_company_email = "Please enter a valid email address.";
    }

    // Password validation
    const password = signUpForm.rental_company_password.trim();

    if (!password) {
      isValid = false;
      errors.rental_company_password = "Password is required";
    } else if (password.length < 8) {
      isValid = false;
      errors.rental_company_password = "Password must be at least 8 characters long";
    } else if (password.length > 15) {
      isValid = false;
      errors.rental_company_password = "Password must be no longer than 15 characters";
    } else if (!/[A-Z]/.test(password)) {
      isValid = false;
      errors.rental_company_password = "Password must contain at least one capital letter";
    } else if (!/[0-9]/.test(password)) {
      isValid = false;
      errors.rental_company_password = "Password must contain at least one number";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      isValid = false;
      errors.rental_company_password = "Password must contain at least one special character";
    }

    // Set errors and return isValid status
    setSignUpErrors(errors);
    return isValid;
  };

  // Handle Sign Up form submission
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    if (validateSignUp()) {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/create-rental-company', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signUpForm),
        });

        const data = await response.json();

        // Handle server response for success and errors
        if (!response.ok) {
          if (data.message === "Username already exists") {
            setSignUpErrors((prevErrors) => ({
              ...prevErrors,
              rental_company_username: "Username is already in use",
            }));
          } else if (data.message === "Email already exists") {
            setSignUpErrors((prevErrors) => ({
              ...prevErrors,
              rental_company_email: "Email is already in use",
            }));
          } else {
            // Display general server error
            setSuccessMessage('Error signing up. Please try again.');
          }
          return;
        }

        // If signup is successful, display success message and navigate
        setSuccessMessage('Sign up successful!');
        setSignUpForm({ rental_company_username: "", rental_company_email: "", rental_company_password: "" }); // Clear form
        navigate("/rental-company-data");
      } catch (error) {
        console.error('Error:', error);
        setSuccessMessage('Error signing up. Please try again.');
      } finally {
        setIsLoading(false);
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
        <div className={`container ${isSignUpMode ? "sign-in-mode" : ""}`}>
          <div className="forms-container">
            <div className="signin-signup">
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

                <input type="submit" className="btn" value={isLoading ? "Signing up..." : "Sign up"} disabled={isLoading} />

                {/* Display success message */}
                {successMessage && <p className="success-message">{successMessage}</p>}
              </form>
            </div>
          </div>
          <div className="panels-container">
            <div className="panel left-panel">
              <div className="content">
                <h3>Creating a Rental Company!</h3>
                <p>Rental Company can add vehicles to rent!</p>
              </div>
              <img src="log.svg" className="image" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
