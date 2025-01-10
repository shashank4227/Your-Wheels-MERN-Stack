import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import './CSS/Navbar.css';

function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // This function ensures that redirection happens based on user actions and token presence
  const handleLoginClick = () => {
    const userType = localStorage.getItem('userType'); // Retrieve user type from local storage
  
    if (userType === 'buyer') {
      navigate('/buyerDashBoard');
    } else if (userType === 'seller') {
      navigate('/seller-dashBoard');
    } else if(userType === 'rental-company') {
      navigate('/rental-company-dashboard'); // Default fallback if no user type is found
    } else if (userType === 'admin') {
      navigate("/adminDashBoard");
    } else {
      navigate("/selectUserType");
    }
  };
  

  return (
    <nav>
      <div>
        <Link to="/">
          <img src="/logo.png" alt="Logo" className='logo' />
        </Link>
      </div>
      <div className='login-signup'>
        <Link to="/search">
          <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: "black", fontSize: "20px" ,marginRight:"20px"}} />
        </Link>
        <button className='login' onClick={handleLoginClick}>
          {isLoggedIn ? 'Dashboard' : 'Login'}
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
