import React,{useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NavBar from '../NavBar';

const SellerMembershipSelection = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/seller-login');
        }
      }, [navigate]);

    // Handle selection of membership plan
    const handleMembershipSelection = (membershipType) => {
        localStorage.setItem('selectedMembership', membershipType);
        navigate('/seller-membership'); // Redirect to seller payment page
    };

    return (
        <div>
            <NavBar />

            <div className="admin-dashboard-container">
                <Link to="/seller-dashBoard" >Seller Profile</Link>
                <Link to="/sellerMembershipSelection" className="active-div">Take Membership</Link>
            </div>

            <div className="membership-selection-container">
                <h2>Select Your Seller Membership</h2>

                <br></br>
                <div className="membership-options">
                    {/* Sell Only Membership */}
                    <div className="membership-card">
                        <h3>Sell Only</h3>
                        <p className="price">1000 / Year</p>
                        <ul>
                            <li>Access to list vehicles for sale</li>
                            <li>Priority support for sellers</li>
                            <li>Exclusive offers for selling premium vehicles</li>
                            <li>Free vehicle inspection and valuation services</li>
                        </ul>
                        <button className='choose-btn' onClick={() => handleMembershipSelection('sell')}>Choose This</button>
                    </div>

                    {/* Rent Only Membership */}
                    <div className="membership-card">
                        <h3>Add to Rent Only</h3>
                        <p className="price">1000 / Year</p>
                        <ul>
                            <li>List vehicles for rent at premium rates</li>
                            <li>Priority listing on rental platforms</li>
                            <li>Free vehicle maintenance for up to 1000 miles</li>
                            <li>24/7 support for renters and owners</li>
                        </ul>
                        <button className='choose-btn' onClick={() => handleMembershipSelection('rent')}>Choose This</button>
                    </div>

                    {/* Sell and Rent Membership - Most Popular */}
                    <div className="membership-card popular">
                        <div className="badge">Most Popular</div>
                        <h3>Sell and Add to Rent</h3>
                        <p className="price">1700 / Year</p>
                        <ul>
                            <li>Full access to sell and rent vehicles</li>
                            <li>Exclusive deals for selling and renting</li>
                            <li>Priority support for sellers and renters</li>
                            <li>Free inspection and maintenance services</li>
                        </ul>
                        <button className='choose-btn' onClick={() => handleMembershipSelection('sell-rent')}>Choose This</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerMembershipSelection;
