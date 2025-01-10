import React, { useState,useEffect } from "react";
import "../CSS/BuyerLogin.css";
import NavBar from '../NavBar.jsx';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const navigate = useNavigate();  // Added navigate hook

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin-login');
    }
  }, [navigate]);

  // Form states
  const [signInForm, setSignInForm] = useState({
    admin_username: "",
    admin_password: "",
  });

  const [signUpForm, setSignUpForm] = useState({
    admin_username: "",
    admin_email: "",
    admin_password: "",
  });

  // Error states
  const [signInErrors, setSignInErrors] = useState({
    admin_username: "",
    admin_password: "",
  });

  const [signUpErrors, setSignUpErrors] = useState({
    admin_username: "",
    admin_email: "",
    admin_password: "",
  });

  // Additional error state for server-side error messages
  const [signInServerError, setSignInServerError] = useState("");

  // Toggle between Sign-in and Sign-up
  const handleSignInClick = () => {
    setIsSignUpMode(false);
  };

  const handleSignUpClick = () => {
    setIsSignUpMode(true);
  };

  // Validate Sign In
  const validateSignIn = () => {
    let isValid = true;
    const errors = { admin_username: "", admin_password: "" };

    if (!signInForm.admin_username.trim()) {
      isValid = false;
      errors.admin_username = "Username is required";
    }

    if (!signInForm.admin_password.trim()) {
      isValid = false;
      errors.admin_password = "Password is required";
    }

    setSignInErrors(errors);
    return isValid;
  };

  // Validate Sign Up
  const validateSignUp = () => {
    let isValid = true;
    const errors = { admin_username: "", admin_email: "", admin_password: "" };

    if (!signUpForm.admin_username.trim()) {
      isValid = false;
      errors.admin_username = "Username is required";
    }

    if (!signUpForm.admin_email.trim()) {
      isValid = false;
      errors.admin_email = "Email is required";
    }

    if (!signUpForm.admin_password.trim()) {
      isValid = false;
      errors.admin_password = "Password is required";
    }

    setSignUpErrors(errors);
    return isValid;
  };

  // Handle Sign In form submission
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setSignInServerError("");  // Clear previous server error

    if (validateSignIn()) {
      try {
        const response = await fetch('http://localhost:5000/adminlogin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signInForm),
        });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          if (response.ok) {
            localStorage.setItem('userType', 'admin');
            localStorage.setItem('token', data.token); // Store token
            const token = localStorage.getItem("token");
            console.log(token);
            
            setSignInForm({ admin_username: "", admin_password: "" }); // Clear form
            navigate('/adminDashBoard'); // Redirect after successful login
          } else {
            setSignInServerError(data.message);  // Set error message from the server
          }
        } else {
          const textResponse = await response.text();
          setSignInServerError('Unexpected response received.');
          console.error('Unexpected response:', textResponse);
        }
      } catch (err) {
        console.error('Error:', err);
        setSignInServerError('Error signing in.');
      }
    }
  };

  // Handle Sign Up form submission
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (validateSignUp()) {
      try {
        const response = await fetch('http://localhost:5000/adminregister', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signUpForm),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        alert('Sign up successful!');
        console.log(data);
      } catch (error) {
        console.error('Error:', error);
        alert('Error signing up.');
      }
    }
  };

  // Update form state for sign-in
  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInForm((prev) => ({ ...prev, [name]: value }));
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
        <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}>
          <div className="forms-container">
            <div className="signin-signup">
              {/* Sign In Form */}
              <form onSubmit={handleSignInSubmit} className="sign-in-form">
                <h2 className="title">Admin Login</h2>
                <div className="input-field">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    placeholder="Username"
                    name="admin_username"
                    value={signInForm.admin_username}
                    onChange={handleSignInChange}
                  />
                </div>
                <span className="error-message">{signInErrors.admin_username}</span>

                <div className="input-field">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    placeholder="Password"
                    name="admin_password"
                    value={signInForm.admin_password}
                    onChange={handleSignInChange}
                  />
                </div>
                <span className="error-message">{signInErrors.admin_password}</span>
                {signInServerError && (
                  <div className="server-error">
                    <p style={{color:"red"}}>{signInServerError}</p>
                  </div>
                )}
                <input type="submit" value="Login" className="btn solid" />

                {/* Display server-side errors */}
                

              
              </form>
            </div>
          </div>

          {/* Panels */}
          <div className="panels-container">
            <div className="panel left-panel">
              <div className="content" style={{ marginRight: "100px" }}>
                <h3>Welcome back Admin!</h3>
                <p>Login to continue</p>
              </div>
              <img src="log.svg" className="image" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
