import React, { useEffect, useState } from 'react';
import NavBar from "../NavBar";
import { Link } from 'react-router-dom';
import BuyerRentCard from './BuyerRentCard';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';

export default function GetRentDetails() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Add state for errors
    const [userData, setUserData] = useState({
        isMember: false,
        membershipType: "",
    });
    const navigate = useNavigate();
    useEffect(() => {
        const fetchVehicles = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found. Redirecting to login.");
                navigate("/buyer-login");
                return;
            }

            // Fetch user data (membership details)
            try {
                const response = await axios.get("http://localhost:5000/getBuyerDetails", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const { isMember, membershipType } = response.data;
                setUserData({ isMember, membershipType });
            } catch (err) {
                console.error("Error fetching buyer details:", err);
            }

            // Fetch rented vehicles
            try {
                const response = await fetch('http://localhost:5000/rented-vehicles-by-buyer', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorDetails = await response.text();
                    throw new Error(`Error fetching vehicles: ${response.status} ${errorDetails}`);
                }

                const data = await response.json();
                console.log("API response data:", data); // Log the full response

                // If the response is an array of objects, directly set it as vehicles
                // Convert object to array if data is an object
            if (Array.isArray(data)) {
                setVehicles(data); // Already an array, just set the state
            } else if (typeof data === 'object') {
                // Check if object is empty
                if (Object.keys(data).length === 0) {
                    setError('No vehicles found.');
                }
            } else {
                console.error("Unexpected data format:", data);
                setError('Unexpected data format received.');
            }
            } catch (err) {
                console.error('Fetch Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    return (
        <div>
            <NavBar />
            <div className="admin-dashboard-container">
                <Link to="/buyerDashBoard">Buyer Profile</Link>
                {userData.isMember && (
                    <>
                        {userData.membershipType === "buy" && <></>}
                        {userData.membershipType === "rent" && (
                            <>
                               <Link to="/rent">Rent Vehicles</Link>
                               <Link to="/buyerRentedVehicles" className="active-div">Rented Vehicles</Link>
                            </>
                        )}
                        {userData.membershipType === "buy-rent" && (
                            <>
                                <Link to="/buy">Buy Vehicles</Link>
                                <Link to="/rent">Rent Vehicles</Link>
                                <Link to="/buyerRentedVehicles" className="active-div">Rented Vehicles</Link>
                            </>
                        )}
                    </>
                )}
            </div>
            <div className="rent-results-container">
                <div className="rent-cards-container">
                    {loading ? (
                        <p>Loading vehicles...</p>
                    ) : error ? (
                        <p>Error: {error}</p>
                    ) : vehicles.length === 0 ? (
                        <p>No vehicles rented.</p> // Message for no rented vehicles
                    ) : (
                        vehicles.map((vehicle) => (
                            <BuyerRentCard key={vehicle._id} vehicle={vehicle} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
