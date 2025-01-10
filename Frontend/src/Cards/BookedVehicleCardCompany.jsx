import React from 'react';

// RentDetailsCard component to display each vehicle's details
const BookedVehicleCard = ({ vehicle }) => {
  
 
    return (
        <div className="rent-card">
            <div className="rent-card-header">
                <h3>{vehicle.vehicleModel}</h3>
                <p>{vehicle.vehicleCompany}</p>
            </div>
            <div className="rent-card-body">
            <div className="rent-card-detail">
                    <strong>Owner Username:</strong> {vehicle.rental_company_username}
                </div>
                <div className="rent-card-detail">
                    <strong>Booked By: </strong> {vehicle.buyer_username}
                </div>
                <div className="rent-card-detail">
                    <strong>Email of Buyer: </strong> {vehicle.buyer_email}
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
            </div>
        </div>
    );
};

export default BookedVehicleCard;
