import '../CSS/Search.css';
import { Link } from 'react-router-dom';
import NavBar from '../NavBar';
import { useState, useEffect } from 'react';
import RentDetailsCard from '../Cards/RentDetailsCard'; // Component to display each vehicle
import { useDispatch, useSelector } from 'react-redux';
import { getBuyerDetails } from '../actions/buyerActions'; // Import Redux action
import { useNavigate } from 'react-router-dom';
export default function Rent() {
    const [vehicles, setVehicles] = useState([]);
    const [formData, setFormData] = useState({
        vehicleType: '',
        location: '',
        fuelType: '',
        vehicleCompany: '',
        vehicleModel: '',
        availabilityStartDate: '',
        availabilityEndDate: ''
    });
    const navigate = useNavigate();
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

    const dispatch = useDispatch();
    const buyerState = useSelector((state) => state.buyer);
    const { userData, error } = buyerState;

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("No token found. Redirecting to login.");
            navigate("/buyer-login");
            return;
        }

        // Fetch buyer details using Redux
        dispatch(getBuyerDetails());
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const currentDate = new Date();
        const startDate = new Date(formData.availabilityStartDate);
        const endDate = new Date(formData.availabilityEndDate);

        // Check if start date is greater than current date
        if (startDate <= currentDate) {
            alert("The availability start date should be greater than the current date.");
            return;
        }

        // Check if end date is greater than start date
        if (endDate <= startDate) {
            alert("The availability end date should be greater than the start date.");
            return;
        }

        // Build query string from formData
        const queryParams = new URLSearchParams(formData).toString();

        try {
            // GET request with query parameters
            const response = await fetch(`http://localhost:5000/search-rent-details?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();
            if (response.ok) {
                setVehicles(result);  // Set fetched data to state
            }
        } catch (error) {
            console.error('Error fetching rent details:', error);
        }
    };

    return (
        <div>
            <NavBar />
            <div className="admin-dashboard-container">
                <Link to="/buyerDashBoard">Buyer Profile</Link>
                {userData?.isMember && (
                    <>
                        {userData.membershipType === "buy" && (
                            <></>
                        )}
                        {userData.membershipType === "rent" && (
                            <>
                               <Link to="/rent" className="active-div">Rent Vehicles</Link>
                               <Link to="/buyerRentedVehicles">Rented Vehicles</Link>

                            </>
                        )}
                        {userData.membershipType === "buy-rent" && (
                            <>
                                <Link to="/buy"  >Buy Vehicles</Link>
                                <Link to="/rent" className="active-div">Rent Vehicles</Link>
                                <Link to="/buyerRentedVehicles">Rented Vehicles</Link>
                            </>
                        )}
                    </>
                )}
            </div>
            <div className="add-rent-content-parent">
                <div className="content">
                    <div>
                        <h1 style={{ paddingTop: '30px', paddingLeft: '50px' }}>
                            Enter your vehicle details to search for rented vehicles
                        </h1>
                    </div>
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-container">
                                <div className="formElement">
                                    <label htmlFor="vehicleType">Vehicle Type</label>
                                    <select id="vehicleType" name="vehicleType" value={formData.vehicleType} onChange={handleChange}>
                                        <option value="">Select Vehicle Type</option>
                                        <option value="Car">Car</option>
                                        <option value="Bike">Bike</option>
                                    </select>
                                </div>
                                <div className="formElement">
                                    <label htmlFor="location">Location</label>
                                    <select id="location" name="location" value={formData.location} onChange={handleChange}>
                                        <option value="">Select Location</option>
                                        <option value="Hyderabad">Hyderabad</option>
                                        <option value="Chennai">Chennai</option>
                                        <option value="Mumbai">Mumbai</option>
                                        <option value="Bangalore">Bangalore</option>
                                    </select>
                                </div>
                                <div className="formElement">
                                    <label htmlFor="fuelType">Fuel Type</label>
                                    <select id="fuelType" name="fuelType" value={formData.fuelType} onChange={handleChange}>
                                        <option value="">Select Fuel Type</option>
                                        <option value="Petrol">Petrol</option>
                                        <option value="Diesel">Diesel</option>
                                        <option value="Electric">Electric</option>
                                        <option value="Hybrid">Hybrid</option>
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
                                    />
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

                                    />
                                </div>
                            </div>

                            <button type="submit" className='search-btn'>Search</button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Rent results section */}
            <div className="rent-results-container">
                <h2>Search Results</h2>
                <div className="rent-cards-container">
                    {vehicles.length > 0 ? (
                        vehicles.map(vehicle => (
                            <RentDetailsCard key={vehicle._id} vehicle={vehicle} />
                        ))
                    ) : (
                        <p>No vehicles found matching your criteria.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
