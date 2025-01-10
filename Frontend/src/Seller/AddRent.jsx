import React, { useEffect, useState } from "react";
import "../CSS/Sell.css";
import NavBar from "../NavBar";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSellerDetails } from "../actions/sellerActions"; // Adjust path as necessary

export default function AddRent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userData, loading, error } = useSelector((state) => state.seller);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/seller-login');
        }
      }, [navigate]);

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    vehicleType: "",
    location: "",
    fuelType: "",
    registrationYear: "",
    vehicleCompany: "",
    vehicleModel: "",
    rentPrice: "",
    availabilityStartDate: "",
    availabilityEndDate: "",
    contactNumber: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear errors on input change
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getNextDay = (dateString) => {
    const date = new Date(dateString || getCurrentDate());
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    dispatch(getSellerDetails());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching seller details:", error);
      navigate("/seller-login");
    }
  }, [error, navigate]);

  const validateForm = () => {
    const errors = {};

    if (!formData.contactNumber) {
      errors.contactNumber = "Contact number is required.";
    } else if (!/^[6-9]\d{9}$/.test(formData.contactNumber)) {
      errors.contactNumber = "Contact number must start with 6-9 and be 10 digits long.";
    }

    const currentDate = new Date();
    const startDate = new Date(formData.availabilityStartDate);
    const endDate = new Date(formData.availabilityEndDate);

    if (!formData.availabilityStartDate || startDate <= currentDate) {
      errors.availabilityStartDate = "Start date must be greater than the current date.";
    }

    if (!formData.availabilityEndDate || endDate <= startDate) {
      errors.availabilityEndDate = "End date must be greater than the start date.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const username = localStorage.getItem("username");
    if (!username) {
      alert("Username is required.");
      return;
    }

    const dataToSubmit = {
      ...formData,
      username,
    };

    try {
      const response = await fetch("http://localhost:5000/submit-rent-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        throw new Error("Failed to submit rent details.");
      }

      const result = await response.json();
      console.log(result);
      navigate("/getRentDetails");
    } catch (error) {
      console.error("Error submitting rent details:", error);
      alert("An error occurred while submitting the rent details.");
    }
  };

  if (loading) {
    return <p>Loading seller details...</p>;
  }

  return (
    <div>
      <NavBar />
      <div className="admin-dashboard-container">
        <Link to="/seller-dashBoard">Seller Profile</Link>
        {userData?.isMember && (
          <>
            {userData.membershipType === "sell" && (
              <>
                <Link to="/sell">Sell Vehicles</Link>
                <Link to="/getSellDetails">Vehicles on Sale</Link>
              </>
            )}
            {userData.membershipType === "rent" && (
              <>
                <Link to="/addRent" className="active-div">
                  Add to Rent
                </Link>
                <Link to="/getRentDetails">Vehicles On Rent</Link>
                <Link to="/booked-vehicles">Booked for Rent</Link>
              </>
            )}
            {userData.membershipType === "sell-rent" && (
              <>
                <Link to="/sell">Sell Vehicles</Link>
                <Link to="/getSellDetails">Vehicles on Sale</Link>
                <Link to="/addRent" className="active-div">
                  Add to Rent
                </Link>
                <Link to="/getRentDetails">Vehicles On Rent</Link>
                <Link to="/booked-vehicles">Booked for Rent</Link>
              </>
            )}
          </>
        )}
      </div>
      <div className="add-rent-content-parent">
        <div className="content">
          <h1 style={{ paddingTop: "30px", paddingLeft: "50px" }}>
            Enter your vehicle details to add into Rented Vehicles
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="form-container">
              <div className="formElement">
                <label htmlFor="vehicleType">Vehicle Type</label>
                <select
                  id="vehicleType"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Vehicle Type</option>
                  <option value="Car">Car</option>
                  <option value="Bike">Bike</option>
                </select>
              </div>
              <div className="formElement">
                <label htmlFor="location">Location</label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Location</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Delhi">Delhi</option>
                </select>
              </div>
              <div className="formElement">
                <label htmlFor="fuelType">Fuel Type</label>
                <select
                  id="fuelType"
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Fuel Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div className="formElement">
                <label htmlFor="registrationYear">Registration Year</label>
                <select
                  id="registrationYear"
                  name="registrationYear"
                  value={formData.registrationYear}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Registration Year</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                  <option value="before 2020">Before 2020</option>
                </select>
              </div>
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
              <div className="formElement">
                <label htmlFor="rentPrice">Rent Price</label>
                <input
                  type="number"
                  id="rentPrice"
                  name="rentPrice"
                  placeholder="Enter rent price"
                  value={formData.rentPrice}
                  onChange={handleChange}
                  min={1}
                  required
                />
              </div>
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
                {errors.availabilityStartDate && (
                  <p className="error-message">{errors.availabilityStartDate}</p>
                )}
              </div>
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
                {errors.availabilityEndDate && (
                  <p className="error-message">{errors.availabilityEndDate}</p>
                )}
              </div>
              <div className="formElement">
                <label htmlFor="contactNumber">Contact Number</label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  placeholder="Enter contact number"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  maxLength={10}
                  required
                />
                {errors.contactNumber && (
                  <p className="error-message">{errors.contactNumber}</p>
                )}
              </div>
              <button type="submit" className="submit-button">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
