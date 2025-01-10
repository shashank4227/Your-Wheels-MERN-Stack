import React,{useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../CSS/BuyerMembershipSelection.css'; // Make sure to update this CSS file
import NavBar from '../NavBar';

const BuyerMembershipSelection = () => {
    const navigate = useNavigate();


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/buyer-login');
        }
      }, [navigate]);

    // Handle selection of membership plan
    const handleMembershipSelection = (membershipType) => {
        localStorage.setItem('selectedMembership', membershipType);
        navigate('/BuyerMembershipPayment'); // Redirect to payment page
    };

    return (
        <div>
            <NavBar />

            <div className="admin-dashboard-container">
                <Link to="/buyerDashBoard" >Buyer Profile</Link>
                <Link to="/buyerMembershipSelection" className="active-div">Take Membership</Link>
            </div>

            <div className="membership-selection-container">
                <h2>Select Your Membership</h2>

                <br></br>
                <div className="membership-options">
                    {/* Buy Only Membership */}
                    <div className="membership-card">
                        <h3>Buy Only</h3>
                        <p className="price">1000 / Year</p>
                        <ul>
                            <li>Access to buy top-class car and bikes</li>
                            <li>Priority customer support</li>
                            <li>Exclusive deals and offers for new vehicles</li>
                            <li>Free vehicle inspection and maintenance for 700 miles</li>
                        </ul>
                        <button className='choose-btn'   onClick={() => handleMembershipSelection('buy')}>Choose This</button>
                    </div>

                    {/* Rent Only Membership */}
                    <div className="membership-card">
                        <h3>Rent Only</h3>
                        <p className="price">1000 / Year</p>
                        <ul>
                            <li>Rent vehicles at discounted rates</li>
                            <li>Access to premium rental listings</li>
                            <li>Free vehicle inspection for 500 miles</li>
                            <li>24/7 roadside assistance</li>
                        </ul>
                        <button className='choose-btn' style={{marginTop:"73px"}}  onClick={() => handleMembershipSelection('rent')}>Choose This</button>
                    </div>

                    {/* Buy and Rent Membership - Most Popular */}
                    <div className="membership-card popular">
                        <div className="badge">Most Popular</div>
                        <h3>Buy and Rent</h3>
                        <p className="price">1700 / Year</p>
                        <ul>
                            <li>Buy and rent vehicles with full access</li>
                            <li>Exclusive deals for buying and renting</li>
                            <li>Priority customer support</li>
                            <li>Free vehicle inspection and maintenance</li>
                        </ul>
                        <button className='choose-btn'    onClick={() => handleMembershipSelection('buy-rent')}>Choose This</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerMembershipSelection;
