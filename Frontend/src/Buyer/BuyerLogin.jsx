import React, { useEffect, useState } from "react";
import "../CSS/BuyerLogin.css";
import NavBar from '../NavBar.jsx';
import { useNavigate } from 'react-router-dom';

export default function BuyerLogin() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [signInForm, setSignInForm] = useState({
    buyer_username: "",
    buyer_password: "",
  });

  const [signUpForm, setSignUpForm] = useState({
    buyer_username: "",
    buyer_email: "",
    buyer_password: "",
  });

  // Error states
  const [signInErrors, setSignInErrors] = useState({});
  const [signUpErrors, setSignUpErrors] = useState({});

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Success message state
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  // Toggle between Sign-in and Sign-up
  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
  };

  // Validate Form - Reusable
  const validateForm = (form, fields) => {
    const errors = {};
    fields.forEach((field) => {
      if (!form[field].trim()) {
        errors[field] = `${field.replace('_', ' ')} is required`;
      }
    });
    return errors;
  };

  const validateSignUp = () => {
    let isValid = true;
    const errors = { buyer_username: "", buyer_email: "", buyer_password: "" };

    // Username validation
    const username = signUpForm.buyer_username.trim();
    const usernameFirstCharPattern = /^[a-zA-Z]/;

    // Additional username validation rules
    const usernameLengthPattern = /^.{3,15}$/; // 3 to 15 characters
    const usernameAlphanumericPattern = /^[a-zA-Z0-9_]+$/; // Alphanumeric and underscores only

    if (!username) {
        isValid = false;
        errors.buyer_username = "Username is required";
    } else if (!usernameFirstCharPattern.test(username)) {
        isValid = false;
        errors.buyer_username = "Username must start with an alphabetic letter";
    } else if (!usernameLengthPattern.test(username)) {
        isValid = false;
        errors.buyer_username = "Username must be between 3 and 15 characters long";
    } else if (!usernameAlphanumericPattern.test(username)) {
        isValid = false;
        errors.buyer_username = "Username can only contain alphanumeric characters and underscores";
    }


    // Email validation
    const email = signUpForm.buyer_email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Additional constraints
    const maxLength = 254; // Maximum email length per RFC standards
    const validDomainPattern = /^[^\s@]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/; // Domains with at least 2 characters in TLD
    const prohibitedCharactersPattern = /^[^<>()[\]{}\\,;:"\s]+$/; // Avoid problematic characters


    if (!email) {
        isValid = false;
        errors.buyer_email = "Email is required";
    } else if (!emailRegex.test(email)) {
        isValid = false;
        errors.buyer_email = "Please enter a valid email address";
    } else if (email.length > maxLength) {
        isValid = false;
        errors.buyer_email = `Email must not exceed ${maxLength} characters`;
    } else if (!validDomainPattern.test(email)) {
        isValid = false;
        errors.buyer_email = "Email domain must be valid (e.g., example.com)";
    } else if (!prohibitedCharactersPattern.test(email)) {
        isValid = false;
        errors.buyer_email = "Email contains invalid characters";
    }

    // Password validation
    const password = signUpForm.buyer_password.trim();

    if (!password) {
      isValid = false;
      errors.buyer_password = "Password is required";
    } else if (password.length < 8) {
      isValid = false;
      errors.buyer_password = "Password must be at least 8 characters long";
    } else if (password.length > 15) {
      isValid = false;
      errors.buyer_password = "Password must be no longer than 15 characters";
    } else if (!/[A-Z]/.test(password)) {
      isValid = false;
      errors.buyer_password = "Password must contain at least one capital letter";
    } else if (!/[0-9]/.test(password)) {
      isValid = false;
      errors.buyer_password = "Password must contain at least one number";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      isValid = false;
      errors.buyer_password = "Password must contain at least one special character";
    }

    // Set errors and return isValid status
    setSignUpErrors(errors);
    return isValid;
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(signInForm, ['buyer_username', 'buyer_password']);
    setSignInErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/buyerlogin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signInForm),
        });

        const data = await response.json();
        setIsLoading(false);

        if (response.ok) {
          localStorage.setItem('userType', 'buyer');
          localStorage.setItem('token', data.token);
          setSignInForm({ buyer_username: "", buyer_password: "" });
          navigate('/buyerDashBoard');
        } else {
          setSignInErrors((prev) => ({ ...prev, apiError: data.message }));
        }
      } catch (err) {
        setIsLoading(false);
        setSignInErrors((prev) => ({ ...prev, apiError: 'Server error' }));
      }
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(signUpForm, ['buyer_username', 'buyer_email', 'buyer_password']);
    setSignUpErrors(errors);
    
    // Call validateSignUp to validate specific sign-up conditions
    if (validateSignUp()) {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/buyerregister', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signUpForm),
        });

        const data = await response.json();
        setIsLoading(false);

        if (response.ok) {
          setSignUpSuccess(true);
          setSignUpForm({ buyer_username: "", buyer_email: "", buyer_password: "" });

          // Automatically switch back to sign-in mode after 2 seconds
          setTimeout(() => {
            setIsSignUpMode(false);
            setSignUpSuccess(false);
          }, 2000);
        } else {
          setSignUpErrors((prev) => ({ ...prev, apiError: data.message }));
        }
      } catch (err) {
        setIsLoading(false);
        setSignUpErrors((prev) => ({ ...prev, apiError: 'Error signing up' }));
      }
    }
  };

  // Handle form changes
  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'signIn') {
      setSignInForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setSignUpForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div>
      <NavBar />
      <div className="login-page">
        <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}>
          <div className="forms-container">
            <div className="signin-signup">

              {/* Sign In Form */}
              <form onSubmit={handleSignInSubmit} className="sign-in-form">
                <h2 className="title">Buyer Login</h2>
                <div className="input-field">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    placeholder="Username"
                    name="buyer_username"
                    value={signInForm.buyer_username}
                    onChange={(e) => handleInputChange(e, 'signIn')}
                  />
                </div>
                <span className="error-message">{signInErrors.buyer_username}</span>

                <div className="input-field">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    placeholder="Password"
                    name="buyer_password"
                    value={signInForm.buyer_password}
                    onChange={(e) => handleInputChange(e, 'signIn')}
                  />
                </div>
                <span className="error-message">{signInErrors.buyer_password}</span>
                <span className="error-message">{signInErrors.apiError}</span>

                <input type="submit" value={isLoading ? "Logging in..." : "Login"} className="btn solid" disabled={isLoading} />
              </form>

              {/* Sign Up Form */}
              <form onSubmit={handleSignUpSubmit} className="sign-up-form">
                <h2 className="title">Buyer Sign up</h2>
                <div className="input-field">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    placeholder="Username"
                    name="buyer_username"
                    value={signUpForm.buyer_username}
                    onChange={(e) => handleInputChange(e, 'signUp')}
                  />
                </div>
                <span className="error-message">{signUpErrors.buyer_username}</span>

                <div className="input-field">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    placeholder="Email"
                    name="buyer_email"
                    value={signUpForm.buyer_email}
                    onChange={(e) => handleInputChange(e, 'signUp')}
                  />
                </div>
                <span className="error-message">{signUpErrors.buyer_email}</span>

                <div className="input-field">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    placeholder="Password"
                    name="buyer_password"
                    value={signUpForm.buyer_password}
                    onChange={(e) => handleInputChange(e, 'signUp')}
                  />
                </div>
                <span className="error-message">{signUpErrors.buyer_password}</span>
                <span className="error-message">{signUpErrors.apiError}</span>
                {signUpSuccess && <span className="success-message">Sign up successful! Please log in.</span>}

                <input type="submit" value={isLoading ? "Signing up..." : "Sign up"} className="btn solid" disabled={isLoading} />
              </form>
            </div>
          </div>

          <div className="panels-container">
            <div className="panel left-panel">
              <div className="content">
                <h3>New here?</h3>
                <p>Sign up and start your journey with us!</p>
                <button className="btn transparent" onClick={toggleMode}>Sign up</button>
              </div>
              <img src="log.svg" className="image" alt="" />
            </div>
            <div className="panel right-panel">
              <div className="content">
                <h3>One of us?</h3>
                <p>To keep connected with us please login with your personal info</p>
                <button className="btn transparent" onClick={toggleMode}>Login</button>
              </div>
              <img src="register.svg" className="image" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
