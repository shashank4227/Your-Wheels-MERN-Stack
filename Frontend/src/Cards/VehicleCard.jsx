// VehicleCard.js
import React from 'react';
import './VehicleCard.css';

const VehicleCard = ({ vehicle }) => {
    
    return (
        <div className="vehicle-card" style={{margin:"20px"}}>
            <h3>{vehicle.vehicleModel} ({vehicle.vehicleCompany})</h3>
            <p><strong>Location:</strong> {vehicle.location}</p>
            <p><strong>Vehicle Type:</strong> {vehicle.vehicleType}</p>
            <p><strong>Fuel Type:</strong> {vehicle.fuelType}</p>
            <p><strong>Registration Year:</strong> {vehicle.registrationYear}</p>
            <p><strong>Selling Price:</strong> ₹{vehicle.sellingPrice}</p>
            <p><strong>Seller Username:</strong> {vehicle.seller_username}</p>
            <p><strong>Seller Contact Number:</strong> {vehicle.contactNumber}</p>
            <p style={{marginBottom:"30px"}}><strong>Seller Email:</strong> {vehicle.seller_email}</p>
        </div>
    );
};

export default VehicleCard;
