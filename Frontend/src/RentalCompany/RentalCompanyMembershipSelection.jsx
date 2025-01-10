import React,{useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NavBar from '../NavBar';

const RentalCompanyMembershipSelection = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/rental-company-login');
        }
      }, [navigate]);

    // Handle selection of membership plan
    const handleMembershipSelection = (membershipType) => {
        localStorage.setItem('selectedMembership', membershipType);
        navigate('/RentalCompanyMembershipPayment'); // Redirect to payment page
    };

    return (
        <div>
            <NavBar />

            <div className="admin-dashboard-container">
                <Link to="/rental-company-dashboard">Rental Company Profile</Link>
                <Link to="/rentalCompanyMembershipSelection" className="active-div">Take Membership</Link>
            </div>

            <div className="membership-selection-container">
                <h2>Select Your Membership</h2>

                <br />
                <div className="membership-options">
                    {/* Rent Only Membership */}
                  

                

                    {/* Buy and Rent Membership - Most Popular */}
                    <div className="membership-card popular">
                        <div className="badge">Most Popular</div>
                        <h3>Add to Rent Only</h3>
                        <p className="price">1000 / Year</p>
                        <ul>
                            <li>List and buy vehicles with full access</li>
                            <li>Priority customer support for both buying and renting</li>
                            <li>Exclusive deals and offers</li>
                            <li>Free inspection and roadside assistance for both purchases and rentals</li>
                        </ul>
                        <button className='choose-btn' onClick={() => handleMembershipSelection('rent')}>
                            Choose This
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RentalCompanyMembershipSelection;
