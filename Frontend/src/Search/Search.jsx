import React, { useState } from 'react';
import axios from 'axios'; // Ensure axios is installed and imported
import '../CSS/Search.css';
import NavBar from '../NavBar';

export default function Search() {
    const [searchResults, setSearchResults] = useState([]); // Store search results
    const [loading, setLoading] = useState(false); // Store loading state

    const handleSearch = async (event) => {
        event.preventDefault();

        setLoading(true);

        // Get form data
        const formData = new FormData(event.target);
        const queryParams = new URLSearchParams(formData).toString();

        // Fetch search results from backend using axios
        try {
            const response = await axios.get(`http://localhost:5000/search-results?${queryParams}`);
            setSearchResults(response.data); // Set the fetched results
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setLoading(false); // Stop loading indicator
        }
    };

    return (
        <div>
            <NavBar />
            <div className="contentParent" style={{ paddingTop: "150px" }}>
                <div className="content">
                    <div>
                        <h1 style={{ paddingTop: '30px' }}>
                            Search Your Desired Vehicle
                        </h1>
                    </div>
                    <div className="searchAndFilters">
                        <form onSubmit={handleSearch} className="Form">
                            <div className="searchBar">
                                <label htmlFor="carName"></label>
                                <input
                                    type="text"
                                    id="carName"
                                    name="query"
                                    placeholder="Enter Vehicle Name"
                                    aria-label="Search for vehicles"
                                />
                                <button type="submit">Search</button>
                            </div>

                            <div className="filters">
                                <label htmlFor="location"></label>
                                <select name="location" id="location" className="filter">
                                    <option value="">Select Location</option>
                                    <option value="Hyderabad">Hyderabad</option>
                                    <option value="Chennai">Chennai</option>
                                    <option value="Bangalore">Bangalore</option>
                                    <option value="Mumbai">Mumbai</option>
                                    <option value="Delhi">Delhi</option>
                                </select>

                                <label htmlFor="type"></label>
                                <select name="type" id="type" className="filter">
                                    <option value="">Select Vehicle Type</option>
                                    <option value="Car">Car</option>
                                    <option value="Bike">Bike</option>
                                </select>

                                <label htmlFor="budget"></label>
                                <select name="budget" id="budget" className="filter">
                                    <option value="">Select Budget</option>
                                    <option value="below 5,00,000">Below 5,00,000</option>
                                    <option value="5,00,000 - 7,50,000">5,00,000 - 7,50,000</option>
                                    <option value="7,50,000 - 20,00,000">7,50,000 - 20,00,000</option>
                                    <option value="20,00,000 - 30,00,000">20,00,000 - 30,00,000</option>
                                    <option value="above 30,00,000">Above 30,00,000</option>
                                </select>

                                <label htmlFor="brand"></label>
                                <select name="brand" id="brand" className="filter">
                                    <option value="">Select Brand</option>
                                    <option value="tata">Tata</option>
                                    <option value="toyota">Toyota</option>
                                    <option value="honda">Honda</option>
                                    <option value="ford">Ford</option>
                                    <option value="chevrolet">Chevrolet</option>
                                    <option value="bmw">BMW</option>
                                    <option value="audi">Audi</option>
                                    <option value="mercedes">Mercedes-Benz</option>
                                    <option value="volkswagen">Volkswagen</option>
                                    <option value="hyundai">Hyundai</option>
                                </select>

                                <label htmlFor="year"></label>
                                <select name="year" id="year" className="filter">
                                    <option value="">Select Year</option>
                                    <option value="0">All Years</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                    <option value="2022">2022</option>
                                    <option value="2021">2021</option>
                                    <option value="2020">2020</option>
                                    <option value="before2020">Before 2020</option>
                                </select>

                                <label htmlFor="fuelType"></label>
                                <select name="fuelType" id="fuelType" className="filter">
                                    <option value="">Select Fuel Type</option>
                                    <option value="all">All Fuel Types</option>
                                    <option value="petrol">Petrol</option>
                                    <option value="diesel">Diesel</option>
                                    <option value="electric">Electric</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Display search results */}
            <div className="search-results-container">
                {loading ? (
                    <p>Loading...</p>
                ) : searchResults.length > 0 ? (
                    searchResults.map((car, index) => (
                        <div key={index} className="car-card">
                            <img src={car.image} alt={car.vehicleName} className="search-car-image" />
                            <div className="car-details">
                                <h3 className="car-model">{car.vehicleName}</h3>
                                <p className="car-brand">Brand: {car.brand}</p>
                                <p className="car-price">Price: {car.budget}</p>
                                <p className="car-location">Location: {car.location}</p>
                                <p className="car-year">Year: {car.year}</p>
                                <p className="car-fuel">Fuel Type: {car.fuelType}</p>
                                <p className="number">Contact Number: {car.number}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No results found</p>
                )}
            </div>
        </div>
    );
}
