import React, { useEffect, useState } from 'react';
import NavBar from "../NavBar";
import { Link,useNavigate } from 'react-router-dom';
import '../CSS/AdminDashBoard.css';

export default function VehiclesOnRent() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/admin-login');
        }
    }, [navigate]);
    
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch('http://localhost:5000/vehicles-on-rent', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setVehicles(data); // Update the vehicles state with the fetched data
                } else {
                    console.error('Error fetching vehicles:', data.message);
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false); // Stop the loading spinner
            }
        };

        fetchVehicles();
    }, []);

    return (
        <div>
            <NavBar />
            <div className="admin-dashboard-container">
                <Link to="/adminDashBoard">Admin Profile</Link>
                <Link to="/buyers-data">Buyers</Link>
                <Link to="/sellers-data">Sellers</Link>
                <Link to="/rental-company-data">Rental Company</Link>
                <Link to="/vehicles-on-rent" className="active-div">Vehicles on Rent</Link>
                <Link to="/rented-vehicles">Rented Vehicles</Link>
                <Link to="/vehicles-on-sale">Vehicles on Sale</Link>
            </div>
            <div className="body-div">
                <p>Browse through extensive list of vehicles that are available to rent</p>
                {loading ? (
                    <p>Loading vehicles...</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Company</th>
                                <th>Model</th>
                                <th>Location</th>
                                <th>Rent Price</th>
                                <th>Vehicle Type</th>
                                <th>Vehicle Fuel Type</th>
                                <th>Vehicle Availability Start Date</th>
                                <th>Vehicle Availability End Date</th>
                                <th>Contact Number</th>
                                <th>Registration Year</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.length > 0 ? (
                                vehicles.map(vehicle => (
                                    <tr key={vehicle._id}>
                                        <td>{vehicle.seller_username || vehicle.rental_company_username}</td>
                                        <td>{vehicle.seller_email || vehicle.rental_company_email}</td>
                                        <td>{vehicle.vehicleCompany}</td>
                                        <td>{vehicle.vehicleModel}</td>
                                        <td>{vehicle.location}</td>
                                        <td>{vehicle.rentPrice}</td>
                                        <td>{vehicle.vehicleType}</td>
                                        <td>{vehicle.fuelType}</td>
                                        <td>{new Date(vehicle.availabilityStartDate).toLocaleDateString()}</td>
                                        <td>{new Date(vehicle.availabilityEndDate).toLocaleDateString()}</td>
                                        <td>{vehicle.contactNumber}</td>
                                        <td>{vehicle.registrationYear}</td>
                                        
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No vehicles available for rent</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
