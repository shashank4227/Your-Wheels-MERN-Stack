import React, { useEffect, useState } from "react";
import NavBar from '../NavBar.jsx';
import { useNavigate } from "react-router-dom";

export default function SellerLogin() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

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
  const [signInErrors, setSignInErrors] = useState({});
  const [signUpErrors, setSignUpErrors] = useState({});

  const navigate = useNavigate();

  // Toggle between Sign-in and Sign-up
  const handleSignInClick = () => {
    setIsSignUpMode(false);
    setSignUpSuccess(false);
  };
  const handleSignUpClick = () => setIsSignUpMode(true);

  // Validate Sign In
  const validateSignIn = () => {
    let isValid = true;
    const errors = {};

    if (!signInForm.seller_username.trim()) {
      isValid = false;
      errors.seller_username = "Username is required";
    }

    if (!signInForm.seller_password.trim()) {
      isValid = false;
      errors.seller_password = "Password is required";
    }

    setSignInErrors(errors);
    return isValid;
  };

  // Validate Sign Up
  const validateSignUp = () => {
    let isValid = true;
    const errors = {};
  
    const username = signUpForm.seller_username;
    const usernameFirstCharPattern = /^[A-Za-z]/;
  
    const usernameLengthPattern = /^.{3,15}$/; // 3 to 15 characters
    const usernameAlphanumericPattern = /^[a-zA-Z0-9_]+$/; // Alphanumeric and underscores only

    if (!username) {
        isValid = false;
        errors.seller_username = "Username is required";
    } else if (!usernameFirstCharPattern.test(username)) {
        isValid = false;
        errors.seller_username = "Username must start with an alphabetic letter";
    } else if (!usernameLengthPattern.test(username)) {
        isValid = false;
        errors.seller_username = "Username must be between 3 and 15 characters long";
    } else if (!usernameAlphanumericPattern.test(username)) {
        isValid = false;
        errors.seller_username = "Username can only contain alphanumeric characters and underscores";
    }


     
  
    if (!signUpForm.seller_email) {
      isValid = false;
      errors.seller_email = "Email is required";
    }
    const validateEmail = (email) => {
      // Remove all special characters except letters, numbers, `@`, `.` and `-`
      let cleanedEmail = email.replace(/[^a-zA-Z0-9@.-]/g, "");
    
      // Check if email contains exactly one `@`, and it follows the structure of a valid email
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
      return emailRegex.test(cleanedEmail) ? cleanedEmail : null;
    };
    if (!signUpForm.seller_email) {
      isValid = false;
      errors.seller_email = "Email is required";
    } else {
      const validatedEmail = validateEmail(signUpForm.seller_email);
      if (!validatedEmail) {
        isValid = false;
        errors.seller_email = "Invalid email format";
      } else {
        signUpForm.seller_email = validatedEmail; // Use cleaned email
      }
    }
        
  
    const password = signUpForm.seller_password;
  
    if (!password) {
      isValid = false;
      errors.seller_password = "Password is required";
    } else if (password.length < 8) {
      isValid = false;
      errors.seller_password = "Password must be at least 8 characters long";
    } else if (password.length > 15) {
      isValid = false;
      errors.seller_password = "Password must be no longer than 15 characters";
    } else if (!/[A-Z]/.test(password)) {
      isValid = false;
      errors.seller_password = "Password must contain at least one capital letter";
    } else if (!/[0-9]/.test(password)) {
      isValid = false;
      errors.seller_password = "Password must contain at least one number";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      isValid = false;
      errors.seller_password = "Password must contain at least one special character";
    }
  
    setSignUpErrors(errors);
    return isValid;
  };

  // Handle Sign In form submission
  const handleSignInSubmit = async (e) => {
    e.preventDefault();

    if (validateSignIn()) {
      try {
        const response = await fetch('http://localhost:5000/sellerlogin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signInForm),
        });

        const data = await response.json();

        if (response.ok) {
          if (data.token && data.user && data.user.username) {
            localStorage.setItem('userType', 'seller');
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.user.username);

            navigate('/seller-dashboard');
          } else {
            console.error('Unexpected response format:', data);
            alert('Unexpected response format. Please try again.');
          }
        } else {
          console.error('Sign-in error:', data);
          alert(data.message || 'Error signing in. Please check your credentials.');
        }
      } catch (err) {
        console.error('Network or server error:', err);
        alert('Error signing in. Please try again later.');
      }
    } else {
      alert('Invalid input. Please check your credentials.');
    }
  };

  useEffect(() => {
    // Add any necessary effect logic here
  }, []);

  // Handle Sign Up form submission
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (validateSignUp()) {
      try {
        const response = await fetch('http://localhost:5000/sellerregister', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signUpForm),
        });

        if (response.ok) {
          const data = await response.json();
          setSignUpSuccess(true);
          setTimeout(() => {
            setIsSignUpMode(false); // Switch to sign-in mode
          }, 2000); // Delay before switching to the sign-in page
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Error signing up.');
        }
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
                <h2 className="title">Seller Login</h2>
                <div className="input-field">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    placeholder="Username"
                    name="seller_username"
                    value={signInForm.seller_username}
                    onChange={handleSignInChange}
                  />
                </div>
                <span className="error-message">{signInErrors.seller_username}</span>

                <div className="input-field">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    placeholder="Password"
                    name="seller_password"
                    value={signInForm.seller_password}
                    onChange={handleSignInChange}
                  />
                </div>
                <span className="error-message">{signInErrors.seller_password}</span>

                <input type="submit" value="Login" className="btn solid" />
              </form>

              {/* Sign Up Form */}
              <form onSubmit={handleSignUpSubmit} className="sign-up-form">
                <h2 className="title">Seller Sign up</h2>
                <div className="input-field">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    placeholder="Username"
                    name="seller_username"
                    value={signUpForm.seller_username}
                    onChange={handleSignUpChange}
                  />
                </div>
                <span className="error-message">{signUpErrors.seller_username}</span>

                <div className="input-field">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    placeholder="Email"
                    name="seller_email"
                    value={signUpForm.seller_email}
                    onChange={handleSignUpChange}
                  />
                </div>
                <span className="error-message">{signUpErrors.seller_email}</span>

                <div className="input-field">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    placeholder="Password"
                    name="seller_password"
                    value={signUpForm.seller_password}
                    onChange={handleSignUpChange}
                  />
                </div>
                <span className="error-message">{signUpErrors.seller_password}</span>

                <input type="submit" className="btn" value="Sign up" />

                {signUpSuccess && (
                  <p className="success-message">
                    Sign up successful! Redirecting to login...
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Overlay */}
          <div className="panels-container">
            <div className="panel left-panel">
              <div className="content">
                <h3>New here?</h3>
                <p>Create a seller account to start selling your vehicles.</p>
                <button className="btn transparent" onClick={handleSignUpClick}>
                  Sign up
                </button>
              </div>
              <img src="log.svg" className="image" alt="" />
            </div>
            <div className="panel right-panel">
              <div className="content">
                <h3>Already a Seller?</h3>
                <p>Log in to access your seller account.</p>
                <button className="btn transparent" onClick={handleSignInClick}>
                  Log in
                </button>
              </div>
              <img src="register.svg" className="image" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
