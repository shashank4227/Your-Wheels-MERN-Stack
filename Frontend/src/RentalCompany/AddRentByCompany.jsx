import React, { useState,useEffect } from 'react';
import '../CSS/Sell.css';
import NavBar from '../NavBar';
import { Link, useNavigate } from 'react-router-dom';

export default function AddRentByCompany() {
    const [formData, setFormData] = useState({
        vehicleType: '',
        location: '',
        fuelType: '',
        registrationYear: '',
        vehicleCompany: '',
        vehicleModel: '',
        rentPrice: '',
        availabilityStartDate: '',
        availabilityEndDate: '',
        contactNumber: '',
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/rental-company-login');
        }
      }, [navigate]);

    // Helper to format date as YYYY-MM-DD
    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const getNextDay = (dateString) => {
        const date = new Date(dateString || getCurrentDate());
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' }); // Clear error on change
    };

    const validateForm = () => {
        const currentDate = new Date();
        const startDate = new Date(formData.availabilityStartDate);
        const endDate = new Date(formData.availabilityEndDate);
        const newErrors = {};

        if (!formData.vehicleType) newErrors.vehicleType = 'Vehicle type is required.';
        if (!formData.location) newErrors.location = 'Location is required.';
        if (!formData.fuelType) newErrors.fuelType = 'Fuel type is required.';
        if (!formData.registrationYear) newErrors.registrationYear = 'Registration year is required.';
        if (!formData.vehicleCompany) newErrors.vehicleCompany = 'Vehicle company is required.';
        if (!formData.vehicleModel) newErrors.vehicleModel = 'Vehicle model is required.';
        if (!formData.rentPrice || isNaN(formData.rentPrice) || formData.rentPrice <= 0) {
            newErrors.rentPrice = 'Valid rent price is required.';
        }
        if (!formData.availabilityStartDate || startDate <= currentDate) {
            newErrors.availabilityStartDate = 'Start date should be greater than today.';
        }
        if (!formData.availabilityEndDate || endDate <= startDate) {
            newErrors.availabilityEndDate = 'End date should be after the start date.';
        }
        if (!formData.contactNumber || !/^[6-9]\d{9}$/.test(formData.contactNumber)) {
            newErrors.contactNumber = 'Contact number must start with 6-9 and be 10 digits.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const username = localStorage.getItem('rental_company_username');
        if (!username) {
            alert('Username is required.');
            return;
        }

        const dataToStore = { ...formData, username };

        try {
            const response = await fetch('http://localhost:5000/add-rent-by-company', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToStore),
            });

            if (response.ok) {
                const data = await response.json();
                alert('Vehicle added successfully!');
                navigate('/getRentDetailsByCompany');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add vehicle. Please try again.');
        }
    };

    return (
        <div>
            <NavBar />
            <div className="admin-dashboard-container">
                <Link to="/rental-company-dashBoard">Rental Company Profile</Link>
                <Link to="/addrentbycompany" className="active-div">Add Vehicles to Rent</Link>
                <Link to="/getRentDetailsByCompany">Vehicles Added to Rent</Link>
                <Link to="/booked-vehicles-company">Booked Vehicles</Link>
            </div>
            <div className="add-rent-content-parent">
                <div className="content">
                    <h1 style={{ paddingTop: '30px', paddingLeft: '50px' }}>
                        Enter your vehicle details to add into Rented Vehicles
                    </h1>
                    <form onSubmit={handleSubmit}>
                    <div className="form-container">
    {/* Vehicle Type */}
    <div className="formElement">
        <label htmlFor="vehicleType">Vehicle Type</label>
        <select id="vehicleType" name="vehicleType" value={formData.vehicleType} onChange={handleChange} required>
            <option value="">Select Vehicle Type</option>
            <option value="Car">Car</option>
            <option value="Bike">Bike</option>
        </select>
    </div>

    {/* Location */}
    <div className="formElement">
        <label htmlFor="location">Location</label>
        <select id="location" name="location" value={formData.location} onChange={handleChange} required>
            <option value="">Select Location</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Chennai">Chennai</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Bangalore">Bangalore</option>
        </select>
    </div>

    {/* Fuel Type */}
    <div className="formElement">
        <label htmlFor="fuelType">Fuel Type</label>
        <select id="fuelType" name="fuelType" value={formData.fuelType} onChange={handleChange} required>
            <option value="">Select Fuel Type</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
        </select>
    </div>

    {/* Registration Year */}
    <div className="formElement">
        <label htmlFor="registrationYear">Registration Year</label>
        <select id="registrationYear" name="registrationYear" value={formData.registrationYear} onChange={handleChange} required>
            <option value="">Select Registration Year</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
            <option value="before 2020">before 2020</option>
        </select>
    </div>

    {/* Vehicle Company */}
    <div className="formElement">
        <label htmlFor="vehicleCompany">Vehicle Company</label>
        <input
            type="text"
            id="vehicleCompany"
            name="vehicleCompany"
            placeholder="Enter vehicle company"
            value={formData.vehicleCompany}
            onChange={handleChange}
            required
        />
    </div>

    {/* Vehicle Model */}
    <div className="formElement">
        <label htmlFor="vehicleModel">Vehicle Model</label>
        <input
            type="text"
            id="vehicleModel"
            name="vehicleModel"
            placeholder="Enter vehicle model"
            value={formData.vehicleModel}
            onChange={handleChange}
            required
        />
    </div>

    {/* Rent Price */}
    <div className="formElement">
        <label htmlFor="rentPrice">Rent Price / day</label>
        <input
            type="number"
            id="rentPrice"
            name="rentPrice"
            placeholder="Enter rent price"
            value={formData.rentPrice}
            onChange={handleChange}
            required
        />
    </div>

    {/* Availability Start Date */}
    <div className="formElement">
        <label htmlFor="availabilityStartDate">Availability Start Date</label>
        <input
            type="date"
            id="availabilityStartDate"
            name="availabilityStartDate"
            value={formData.availabilityStartDate}
                                    onChange={handleChange}
                  min={getCurrentDate()}
                                    
            required
        />
    </div>

    {/* Availability End Date */}
    <div className="formElement">
        <label htmlFor="availabilityEndDate">Availability End Date</label>
        <input
            type="date"
            id="availabilityEndDate"
            name="availabilityEndDate"
            value={formData.availabilityEndDate}
                                    onChange={handleChange}
            min={getNextDay(formData.availabilityStartDate)}
                                    
            required
        />
    </div>

    {/* Contact Number */}
    <div className="formElement">
        <label htmlFor="contactNumber">Contact Number</label>
        <input
            type="tel"
            id="contactNumber"
            name="contactNumber"
            placeholder="Enter contact number"
            value={formData.contactNumber}
                                    onChange={handleChange}
            maxLength="10"
                                    
            required
        />
    </div>

    {/* Display error messages */}
    {Object.keys(errors).map((key) => (
        errors[key] && <p key={key} className="error-message">{errors[key]}</p>
    ))}
</div>

                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
