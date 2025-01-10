import React, { useState, useEffect } from "react";
import "../CSS/BuyerLogin.css";
import NavBar from "../NavBar.jsx";
import { useNavigate } from "react-router-dom";

export default function AddSellerByAdmin() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const navigate = useNavigate();

  // Redirect if no token is present
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/admin-login");
  }, [navigate]);

  // Form states
  const [signInForm, setSignInForm] = useState({
    seller_username: "",
    seller_password: "",
  });

  const [signUpForm, setSignUpForm] = useState({
    seller_username: "",
    seller_email: "",
    seller_password: "",
  });

  // Error states
  const [signInErrors, setSignInErrors] = useState({
    seller_username: "",
    seller_password: "",
    apiError: "",
  });

  const [signUpErrors, setSignUpErrors] = useState({
    seller_username: "",
    seller_email: "",
    seller_password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Handlers to toggle between sign-in and sign-up
  const handleSignInClick = () => setIsSignUpMode(false);
  const handleSignUpClick = () => setIsSignUpMode(true);

  // Input Handlers
  const handleInputChange = (e, formSetter) => {
    const { name, value } = e.target;
    formSetter((prev) => ({ ...prev, [name]: value }));
  };

  // Validation Functions
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateSignUp = () => {
    const errors = {};
    let isValid = true;

    const { seller_username, seller_email, seller_password } = signUpForm;

    if (!seller_username) {
      isValid = false;
      errors.seller_username = "Username is required.";
    } else if (!/^[A-Za-z][A-Za-z0-9_]{2,14}$/.test(seller_username)) {
      isValid = false;
      errors.seller_username =
        "Username must start with a letter and be 3-15 characters.";
    }

    if (!seller_email) {
      isValid = false;
      errors.seller_email = "Email is required.";
    } else if (!validateEmail(seller_email)) {
      isValid = false;
      errors.seller_email = "Invalid email format.";
    }

    if (!seller_password) {
      isValid = false;
      errors.seller_password = "Password is required.";
    } else if (
      seller_password.length < 8 ||
      !/[A-Z]/.test(seller_password) ||
      !/[0-9]/.test(seller_password) ||
      !/[!@#$%^&*]/.test(seller_password)
    ) {
      isValid = false;
      errors.seller_password =
        "Password must be at least 8 characters, include an uppercase letter, a number, and a special character.";
    }

    setSignUpErrors(errors);
    return isValid;
  };

  const validateSignIn = () => {
    const errors = {};
    let isValid = true;

    const { seller_username, seller_password } = signInForm;

    if (!seller_username) {
      isValid = false;
      errors.seller_username = "Username is required.";
    }

    if (!seller_password) {
      isValid = false;
      errors.seller_password = "Password is required.";
    }

    setSignInErrors(errors);
    return isValid;
  };

  // Submission Handlers
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    if (validateSignUp()) {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5000/sellerregister", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(signUpForm),
        });

        if (response.ok) {
          alert("Seller registered successfully!");
          setSignUpForm({ seller_username: "", seller_email: "", seller_password: "" });
          navigate("/sellers-data");
        } else {
          const errorData = await response.json();
          alert(errorData.message || "Error registering seller.");
        }
      } catch (err) {
        console.error(err);
        alert("Error connecting to the server.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();

    if (validateSignIn()) {
      try {
        const response = await fetch("http://localhost:5000/sellerlogin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(signInForm),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("token", data.token);
          navigate("/sellerDashboard");
        } else {
          const errorData = await response.json();
          alert(errorData.message || "Error signing in.");
        }
      } catch (err) {
        console.error(err);
        alert("Error connecting to the server.");
      }
    }
  };

  return (
    <div>
      <NavBar />
      <div className="login-page">
        <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}>
          <div className="forms-container">
            <div className="signin-signup">
              <form onSubmit={handleSignUpSubmit} className="sign-in-form">
                <h2 className="title">Register Seller</h2>

                <div className="input-field">
                  <input
                    type="text"
                    placeholder="Username"
                    name="seller_username"
                    value={signUpForm.seller_username}
                    onChange={(e) => handleInputChange(e, setSignUpForm)}
                  />
                  <span className="error-message">{signUpErrors.seller_username}</span>
                </div>

                <div className="input-field">
                  <input
                    type="email"
                    placeholder="Email"
                    name="seller_email"
                    value={signUpForm.seller_email}
                    onChange={(e) => handleInputChange(e, setSignUpForm)}
                  />
                  <span className="error-message">{signUpErrors.seller_email}</span>
                </div>

                <div className="input-field">
                  <input
                    type="password"
                    placeholder="Password"
                    name="seller_password"
                    value={signUpForm.seller_password}
                    onChange={(e) => handleInputChange(e, setSignUpForm)}
                  />
                  <span className="error-message">{signUpErrors.seller_password}</span>
                </div>

                <button type="submit" className="btn" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Sign Up"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
