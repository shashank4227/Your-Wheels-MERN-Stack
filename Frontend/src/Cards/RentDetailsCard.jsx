import React from 'react';
import '../CSS/RentDetailsCard.css'; // Assuming you're adding styles in this CSS file
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

// RentDetailsCard component to display each vehicle's details
const RentDetailsCard = ({ vehicle }) => {
    const navigate = useNavigate();

    const handleBookNow = () => {
        // Generate a unique token for the booking
        const token = uuidv4();
        // Store the token and vehicle details in local storage
        localStorage.setItem('bookingToken', token);
        localStorage.setItem('vehicleDetails', JSON.stringify(vehicle));
        // console.log(vehicle.rentVehicleID);
        // Redirect to payment page
        navigate('/fakePayment');
    };
    return (
        <div className="rent-card">
            <div className="rent-card-header">
                <h3>{vehicle.vehicleModel}</h3>
                <p>{vehicle.vehicleCompany}</p>
            </div>
            <div className="rent-card-body">
            <div className="rent-card-detail">
                    <strong>Owner Username:</strong> {vehicle.seller_username}
                </div>
                <div className="rent-card-detail">
                    <strong>Vehicle Type:</strong> {vehicle.vehicleType}
                </div>
                <div className="rent-card-detail">
                    <strong>Location:</strong> {vehicle.location}
                </div>
                <div className="rent-card-detail">
                    <strong>Fuel Type:</strong> {vehicle.fuelType}
                </div>
                <div className="rent-card-detail">
                    <strong>Registration Year:</strong> {vehicle.registrationYear}
                </div>
                <div className="rent-card-detail">
                    <strong>Contact Number:</strong> {vehicle.contactNumber}
                </div>
                <div className="rent-card-detail">
                    <strong>Email:</strong> {vehicle.seller_email}
                </div>
                <div className="rent-card-detail">
                    <strong>Rent Price:</strong> ₹{vehicle.rentPrice} / day
                </div>
                <div className="rent-card-detail">
                    <strong>Available From:</strong> {new Date(vehicle.availabilityStartDate).toLocaleDateString()}
                </div>
                <div className="rent-card-detail">
                    <strong>Available Till:</strong> {new Date(vehicle.availabilityEndDate).toLocaleDateString()}
                </div>
                <button onClick={handleBookNow} className="book-now-button">BOOK NOW</button>
            </div>
        </div>
    );
};

export default RentDetailsCard;
