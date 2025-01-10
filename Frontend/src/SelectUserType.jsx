import React from 'react';
import './CSS/SelectUserType.css';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router

export default function SelectUserType() {
    const navigate = useNavigate(); // Hook to navigate to other routes

    // Function to handle user type click and redirect
    const handleUserTypeClick = (type) => {
        if (type === 'Buyer') {
            navigate('/buyer-login'); // Redirect to Buyer login or signup
        } else if (type === 'Seller') {
            navigate('/seller-login'); // Redirect to Seller login or signup
        } else if (type === 'RentalCompany') {
            navigate('/rental-company-login'); // Redirect to Rental Company login or signup
        }
    };

    return (
        <div>
            <NavBar />
            <div className='parent-div'>
                <div className='box-container'>
                    <h3>Which describes you better?</h3>
                    <div
                        className='box'
                        onClick={() => handleUserTypeClick('Buyer')}
                    >
                        <p>Buyer</p>
                    </div>
                    <div
                        className='box'
                        onClick={() => handleUserTypeClick('Seller')}
                    >
                        <p>Seller</p>
                    </div>
                    <div
                        className='box'
                        onClick={() => handleUserTypeClick('RentalCompany')}
                    >
                        <p>Rental Company</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
