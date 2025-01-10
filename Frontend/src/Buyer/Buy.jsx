import React, { useState, useEffect } from 'react';
import '../CSS/Search.css';
import NavBar from '../NavBar';
import VehicleCard from '../Cards/VehicleCard'; // Import the new VehicleCard component
import { Link,useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getBuyerDetails } from '../actions/buyerActions';

export default function Search() {
    const [carName, setCarName] = useState('');
    const [location, setLocation] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [budget, setBudget] = useState('');
    const [vehicleCompany, setVehicleCompany] = useState('');
    const [registrationYear, setRegistrationYear] = useState('');
    const [fuelType, setFuelType] = useState('');
    const [results, setResults] = useState([]);
    const [searchInitiated, setSearchInitiated] = useState(false); // New state to track if search is initiated
    

    const dispatch = useDispatch();

    const buyerState = useSelector((state) => state.buyer);
    const { loading, userData, error } = buyerState;

    useEffect(() => {
        dispatch(getBuyerDetails());
    }, [dispatch]);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/buyer-login');
        }
      }, [navigate]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Reset results before making a new search
        setResults([]);
        setSearchInitiated(true); // Mark the search as initiated
    
        try {
            // Construct query parameters
            const queryParams = new URLSearchParams({
                carName,
                location,
                vehicleType,
                budget,
                vehicleCompany,
                registrationYear,
                fuelType
            }).toString();
    
            // Make GET request using fetch with queryParams in the URL
            const response = await fetch(`http://localhost:5000/search-used-vehicles?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            // Check if the response is okay
            if (!response.ok) {
                throw new Error('Failed to fetch vehicles');
            }
    
            // Parse the response data
            const data = await response.json();
    
            // Assuming the response contains vehicles in data.vehicles
            setResults(data.vehicles);
    
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            setResults([]); // Ensure no results are shown in case of an error
        }
    };
    
    
    return (
        <div>
            <NavBar />
            <div className="admin-dashboard-container">
                <Link to="/buyerDashBoard">Buyer Profile</Link>
                {userData.isMember && (
                    <>
                        {userData.membershipType === "buy" && (
                            <Link to="/buy" className="active-div">Buy Vehicles</Link>
                        )}
                        {userData.membershipType === "rent" && (
                            <>
                                {/* Add rent specific links here */}
                            </>
                        )}
                        {userData.membershipType === "buy-rent" && (
                            <>
                                <Link to="/buy" className="active-div">Buy Vehicles</Link>
                                <Link to="/rent">Rent Vehicles</Link>
                                <Link to="/buyerRentedVehicles">Rented Vehicles</Link>
                            </>
                        )}
                    </>
                )}
            </div>

            <div className="contentParent">
                <div className="content">
                    <h1 style={{ paddingTop: '30px' }}>
                        Search Your Desired Vehicle to Buy
                    </h1>
                    <div className="searchAndFilters">
                        <form onSubmit={handleSubmit} className="Form">
                            <div className="searchBar">
                                <input
                                    type="text"
                                    id="carName"
                                    value={carName}
                                    onChange={(e) => setCarName(e.target.value)}
                                    placeholder="Enter Vehicle Name"
                                    aria-label="Search for vehicles"
                                />
                                <button type="submit">Search</button>
                            </div>

                            <div className="filters">
                                <select
                                    name="location"
                                    id="location"
                                    className="filter"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                >
                                    <option value="">Select Location</option>
                                    <option value="Hyderabad">Hyderabad</option>
                                    <option value="Chennai">Chennai</option>
                                    <option value="Bangalore">Bangalore</option>
                                    <option value="Mumbai">Mumbai</option>
                                    <option value="Delhi">Delhi</option>
                                </select>

                                <select
                                    name="vehicleType"
                                    id="type"
                                    className="filter"
                                    value={vehicleType}
                                    onChange={(e) => setVehicleType(e.target.value)}
                                >
                                    <option value="">Select Vehicle Type</option>
                                    <option value="Car">Car</option>
                                    <option value="Bike">Bike</option>
                                </select>

                                <select
                                    name="budget"
                                    id="budget"
                                    className="filter"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                >
                                    <option value="">Select Budget</option>
                                    <option value="below 5,00,000">Below 5,00,000</option>
                                    <option value="5,00,000 - 7,50,000">5,00,000 - 7,50,000</option>
                                    <option value="7,50,000 - 20,00,000">7,50,000 - 20,00,000</option>
                                    <option value="20,00,000 - 30,00,000">20,00,000 - 30,00,000</option>
                                    <option value="above 30,00,000">Above 30,00,000</option>
                                </select>

                                <select
                                    name="vehicleCompany"
                                    id="brand"
                                    className="filter"
                                    value={vehicleCompany}
                                    onChange={(e) => setVehicleCompany(e.target.value)}
                                >
                                    <option value="">Select Brand</option>
                                    <option value="Tata">Tata</option>
                                    <option value="Toyota">Toyota</option>
                                    <option value="Honda">Honda</option>
                                    <option value="Ford">Ford</option>
                                    <option value="Chevrolet">Chevrolet</option>
                                    <option value="Bmw">BMW</option>
                                    <option value="Audi">Audi</option>
                                    <option value="Mercedes">Mercedes-Benz</option>
                                    <option value="Volkswagen">Volkswagen</option>
                                    <option value="Hyundai">Hyundai</option>
                                </select>

                                <select
                                    name="registrationYear"
                                    id="year"
                                    className="filter"
                                    value={registrationYear}
                                    onChange={(e) => setRegistrationYear(e.target.value)}
                                >
                                    <option value="">Select Year</option>
                                    <option value="0">All Years</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                    <option value="2022">2022</option>
                                    <option value="2021">2021</option>
                                    <option value="2020">2020</option>
                                    <option value="before2020">Before 2020</option>
                                </select>

                                <select
                                    name="fuelType"
                                    id="fuelType"
                                    className="filter"
                                    value={fuelType}
                                    onChange={(e) => setFuelType(e.target.value)}
                                >
                                    <option value="">Select Fuel Type</option>
                                    <option value="All">All Fuel Types</option>
                                    <option value="Petrol">Petrol</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Electric">Electric</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                            </div>
                        </form>
                    </div>

                    {/* Display search results */}
                    {!searchInitiated && (
                        <p style={{ textAlign: "center", marginTop: "70px", color: "black" }}>
                            Search results will be displayed here
                        </p>
                    )}

                    {searchInitiated && results.length === 0 && (
                        <p style={{ textAlign: "center", marginTop: "70px", color: "black" }}>
                            No search results found.
                        </p>
                    )}

                    {searchInitiated && results.length > 0 && (
                        <div className="vehicle-results" style={{display:"flex",justifyContent:"center",alignItems:"center",flexWrap:"wrap"}}>
                            {results.map((vehicle) => (
                                <VehicleCard key={vehicle._id} vehicle={vehicle} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
