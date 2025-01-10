import React from 'react';
import '../CSS/RentDetailsCard.css'; // Your CSS file for styles
import { Link } from 'react-router-dom';

const VehicleOnSaleCard = ({ vehicle, onDelete }) => {
    // Function to handle the delete action with confirmation
    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this vehicle?")) {
            onDelete(vehicle.id); // Call the onDelete prop with vehicle ID
        }
    };
    localStorage.setItem('vehicleID', vehicle._id);


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
                    <b><strong>Selling Price:</strong> {vehicle.sellingPrice}</b>
                </div>
                <div className="rent-card-detail">
                    <strong>Email:</strong> {vehicle.seller_email}
                </div>
                {/* <div className="rent-card-actions">
                    <Link to="/update-price-page">
                        <button>Edit</button>
                    </Link>
                    <button onClick={handleDelete}>Delete</button>
                </div> */}
            </div>
        </div>
    );
};

export default VehicleOnSaleCard;
