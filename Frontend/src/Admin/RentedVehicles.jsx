import { useEffect, useState } from 'react';
import NavBar from "../NavBar";
import { Link,useNavigate } from 'react-router-dom';
import '../CSS/AdminDashBoard.css';


export default function RentedVehicles() {
    const [rentedVehicles, setRentedVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/admin-login');
        }
      }, [navigate]);

    useEffect(() => {
        const fetchRentedVehicles = async () => {
            try {
                const response = await fetch('http://localhost:5000/rented-vehicles-by-admin'); // Adjust the URL as needed
                const data = await response.json();
                setRentedVehicles(data);
            } catch (error) {
                console.error("Error fetching rented vehicles:", error);
            } finally {
                setLoading(false); // Ensure loading is stopped
            }
        };

        fetchRentedVehicles();
    }, []);

    return (
        <div>
            <NavBar />
            <div className="admin-dashboard-container">
                <Link to="/adminDashBoard" >Admin Profile</Link>
                <Link to="/buyers-data">Buyers</Link>
                <Link to="/sellers-data">Sellers</Link>
                <Link to="/rental-company-data">Rental Company</Link>
                <Link to="/vehicles-on-rent">Vehicles on Rent</Link>
                <Link to="/rented-vehicles" className="active-div">Rented Vehicles</Link>
                <Link to="/vehicles-on-sale">Vehicles on Sale</Link>
            </div>
            <div className="body-div" style={{ flexWrap: "wrap"}}>
                <p>Browse through extensive list of vehicles that are rented</p>
                {loading ? (
                    <p>Loading vehicles...</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Buyer Username</th>
                                <th>Buyer Email</th>
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
                            {rentedVehicles.length > 0 ? (
                                rentedVehicles.map(vehicle => (
                                    <tr key={vehicle._id}>
                                        <td>{vehicle.seller_username  || vehicle.rental_company_username}</td>
                                        <td>{vehicle.seller_email  || vehicle.rental_company_email}</td>
                                        <td>{vehicle.buyer_username}</td>
                                        <td>{vehicle.buyer_email}</td>
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
                                    <td colSpan="12">No vehicles available for rent</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
