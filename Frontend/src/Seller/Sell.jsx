import "../CSS/Sell.css";
import NavBar from "../NavBar";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSellerDetails } from "../actions/sellerActions"; // Adjust the path as necessary

export default function SellVehicle() {
  const [formData, setFormData] = useState({
    vehicleType: "",
    location: "",
    fuelType: "",
    registrationYear: "",
    vehicleCompany: "",
    vehicleModel: "",
    sellingPrice: "",
    contactNumber: "",
  });

  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData, loading: userLoading, error } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(getSellerDetails());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching seller details:", error);
      navigate("/seller-login");
    }
  }, [error, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear errors as the user types
  };

  const validateContactNumber = (number) => {
    const contactNumberRegex = /^[6-9]\d{9}$/;
    if (!number) {
      return "Contact number is required.";
    } else if (!contactNumberRegex.test(number)) {
      return "Contact number must start with 6-9 and be 10 digits long.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = localStorage.getItem("username");

    // Validate contact number
    const contactNumberError = validateContactNumber(formData.contactNumber);

    if (contactNumberError) {
      setErrors((prevErrors) => ({ ...prevErrors, contactNumber: contactNumberError }));
      return;
    }

    const dataToSubmit = {
      ...formData,
      username,
    };

    try {
      const response = await fetch("http://localhost:5000/submitSellDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        throw new Error("Failed to submit vehicle details.");
      }

      const result = await response.json();
      console.log(result);
      navigate("/getSellDetails");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting the vehicle details.");
    }
  };

  if (userLoading) {
    return <p>Loading seller details...</p>;
  }

  return (
    <div>
      <NavBar />
      <div className="admin-dashboard-container">
        <Link to="/seller-dashBoard">Seller Profile</Link>
        {userData.isMember && (
          <>
            {userData.membershipType === "sell" && (
              <>
                <Link to="/sell" className="active-div">Sell Vehicles</Link>
                <Link to="/getSellDetails">Vehicles on Sale</Link>
              </>
            )}
            {userData.membershipType === "rent" && (
              <>
                <Link to="/addrent">Add to Rent</Link>
                <Link to="/sellerRentedVehicles">Rented Vehicles</Link>
                <Link to="/booked-vehicles">Booked for Rent</Link>
              </>
            )}
            {userData.membershipType === "sell-rent" && (
              <>
                <Link to="/sell" className="active-div">Sell Vehicles</Link>
                <Link to="/getSellDetails">Vehicles on Sale</Link>
                <Link to="/addrent">Add to Rent</Link>
                <Link to="/sellerRentedVehicles">Rented Vehicles</Link>
                <Link to="/booked-vehicles">Booked for Rent</Link>
              </>
            )}
          </>
        )}
      </div>
      <div className="contentParent">
        <div className="content">
          <h1 style={{ paddingTop: "30px", paddingLeft: "50px" }}>
            Enter your vehicle details to sell
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="form-container">
              {/* Other form elements */}
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
                                <label htmlFor="sellingPrice">Selling Price</label>
                                <input
                                    type="number"
                                    id="sellingPrice"
                                    name="sellingPrice"
                                    placeholder="Enter vehicle selling price"
                                    value={formData.sellingPrice}
                  onChange={handleChange}
                  min={1}
                                    required
                                />
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
            </div>

            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
