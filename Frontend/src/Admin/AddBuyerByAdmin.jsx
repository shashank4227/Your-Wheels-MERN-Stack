import React, { useState, useEffect } from "react";
import "../CSS/BuyerLogin.css";
import NavBar from "../NavBar.jsx";
import { useNavigate } from "react-router-dom";

export default function AddBuyerByAdmin() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [signInForm, setSignInForm] = useState({ buyer_username: "", buyer_password: "" });
  const [signUpForm, setSignUpForm] = useState({ buyer_username: "", buyer_email: "", buyer_password: "" });

  // Error states
  const [signInErrors, setSignInErrors] = useState({ buyer_username: "", buyer_password: "", apiError: "" });
  const [signUpErrors, setSignUpErrors] = useState({ buyer_username: "", buyer_email: "", buyer_password: "" });
  const [apiError, setApiError] = useState(""); // State to display API errors

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Validation patterns
  const validationPatterns = {
    username: {
      firstChar: /^[a-zA-Z]/,
      length: /^.{3,15}$/,
      alphanumeric: /^[a-zA-Z0-9_]+$/
    },
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: {
      minLength: 8,
      maxLength: 15,
      uppercase: /[A-Z]/,
      number: /[0-9]/,
      specialChar: /[!@#$%^&*(),.?":{}|<>]/
    }
  };

  // Toggle between Sign-in and Sign-up
  const handleSignInClick = () => setIsSignUpMode(false);
  const handleSignUpClick = () => setIsSignUpMode(true);

  // Validate Sign Up
  const validateSignUp = () => {
    let isValid = true;
    const errors = { buyer_username: "", buyer_email: "", buyer_password: "" };

    const { buyer_username, buyer_email, buyer_password } = signUpForm;
    const { username, email, password } = validationPatterns;

    // Username validation
    if (!buyer_username.trim()) {
      errors.buyer_username = "Username is required";
      isValid = false;
    } else if (!username.firstChar.test(buyer_username)) {
      errors.buyer_username = "Username must start with an alphabetic letter";
      isValid = false;
    } else if (!username.length.test(buyer_username)) {
      errors.buyer_username = "Username must be between 3 and 15 characters";
      isValid = false;
    } else if (!username.alphanumeric.test(buyer_username)) {
      errors.buyer_username = "Username can only contain alphanumeric characters and underscores";
      isValid = false;
    }

    // Email validation
    if (!buyer_email.trim()) {
      errors.buyer_email = "Email is required";
      isValid = false;
    } else if (!email.test(buyer_email)) {
      errors.buyer_email = "Invalid email address";
      isValid = false;
    }

    // Password validation
    if (!buyer_password.trim()) {
      errors.buyer_password = "Password is required";
      isValid = false;
    } else if (buyer_password.length < password.minLength) {
      errors.buyer_password = "Password must be at least 8 characters long";
      isValid = false;
    } else if (buyer_password.length > password.maxLength) {
      errors.buyer_password = "Password must not exceed 15 characters";
      isValid = false;
    } else if (!password.uppercase.test(buyer_password)) {
      errors.buyer_password = "Password must contain at least one uppercase letter";
      isValid = false;
    } else if (!password.number.test(buyer_password)) {
      errors.buyer_password = "Password must contain at least one number";
      isValid = false;
    } else if (!password.specialChar.test(buyer_password)) {
      errors.buyer_password = "Password must contain at least one special character";
      isValid = false;
    }

    setSignUpErrors(errors);
    return isValid;
  };

  // Handle Sign Up form submission
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    if (validateSignUp()) {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5000/buyerregister", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(signUpForm),
        });

        const data = await response.json();
        setIsLoading(false);

        if (response.ok) {
          setSignUpForm({ buyer_username: "", buyer_email: "", buyer_password: "" });
          setTimeout(() => setIsSignUpMode(false), 2000);
          navigate("/buyers-data")
        } else {
          setApiError(data.message || "Error signing up");
        }
      } catch {
        setIsLoading(false);
        setApiError("Error signing up");
      }
    }
  };

  // Update form state
  const handleChange = (e, formSetter) => {
    const { name, value } = e.target;
    formSetter((prev) => ({ ...prev, [name]: value }));
  };

  // Redirect to login if no token is present
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/admin-login");
  }, [navigate]);

  return (
    <div>
      <NavBar />
      <div className="login-page">
        <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}>
          <div className="forms-container">
            <div className="signin-signup">
              {/* Sign Up Form */}
              <form onSubmit={handleSignUpSubmit} className="sign-in-form">
                <h2 className="title">Create Buyer User</h2>

                <div className="input-field">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    placeholder="Username"
                    name="buyer_username"
                    value={signUpForm.buyer_username}
                    onChange={(e) => handleChange(e, setSignUpForm)}
                  />
                  {signUpErrors.buyer_username && (
                    <span className="error-message">{signUpErrors.buyer_username}</span>
                  )}
                </div>

                <div className="input-field">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    placeholder="Email"
                    name="buyer_email"
                    value={signUpForm.buyer_email}
                    onChange={(e) => handleChange(e, setSignUpForm)}
                  />
                  {signUpErrors.buyer_email && (
                    <span className="error-message">{signUpErrors.buyer_email}</span>
                  )}
                </div>

                <div className="input-field">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    placeholder="Password"
                    name="buyer_password"
                    value={signUpForm.buyer_password}
                    onChange={(e) => handleChange(e, setSignUpForm)}
                  />
                  {signUpErrors.buyer_password && (
                    <span className="error-message">{signUpErrors.buyer_password}</span>
                  )}
                </div>

                <input
                  type="submit"
                  className="btn"
                  value={isLoading ? "Signing up..." : "Sign up"}
                  disabled={isLoading}
                />

                {apiError && <div className="api-error-message">{apiError}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
