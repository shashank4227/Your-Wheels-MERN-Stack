import React, { useEffect, useState } from 'react';
import NavBar from "../NavBar";
import { Link,useNavigate } from 'react-router-dom';
import SellerRentDetailsByCompany from "../Cards/SellerRentDetailsByCompany";

export default function GetRentDetailsByCompany() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/rental-company-login');
        }
    }, [navigate]);
    
    useEffect(() => {
        const fetchVehicles = async () => {
            try {

                const response = await fetch('http://localhost:5000/vehicles-by-company', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });

                // Check if response is okay
                if (response.ok) {
                    const data = await response.json();
                    setVehicles(data); // Update state with fetched vehicles
                } else {
                    const errorData = await response.json();
                    console.error('Error fetching vehicles:', errorData.message);
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false); // Stop loading spinner
            }
        };

        fetchVehicles();
    }, []);

    return (
        <div>
            <NavBar />
            <div className="admin-dashboard-container">
                <Link to="/rental-company-dashBoard">Rental Company Profile</Link>
                <Link to="/addRentByCompany">Add Vehicles to Rent</Link>
                <Link to="/getRentDetailsByCompany" className="active-div">Vehicles Added to Rent</Link>
                <Link to="/booked-vehicles-company">Booked Vehicles</Link>
            </div>
            <div className="rent-results-container">
                <div className="rent-cards-container">
                    {loading ? (
                        <p>Loading vehicles...</p>
                    ) : vehicles.length > 0 ? (
                        vehicles.map((vehicle) => (
                            <SellerRentDetailsByCompany key={vehicle._id} vehicle={vehicle} />
                        ))
                    ) : (
                        <p>No vehicles found for this rental company.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
