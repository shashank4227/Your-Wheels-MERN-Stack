import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NavBar from "../NavBar";
import { Link, useNavigate } from 'react-router-dom';
import { fetchAdminVehiclesOnSale } from '../actions/adminActions';
import '../CSS/AdminDashBoard.css';
import axios from 'axios';

export default function AdminDashBoard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/admin-login');
        }
      }, [navigate]);

    // Local state for admin details and rented vehicles
    const [userData, setUserData] = useState({
        username: "",
        email: "",
    });
    const [rentedVehicleCount, setRentedVehicleCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Redux state for vehicles on sale
    const adminVehiclesState = useSelector((state) => state.adminVehiclesOnSale);
    const { loading: vehiclesLoading, vehicles, error } = adminVehiclesState;

    useEffect(() => {
        const fetchAdminData = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found. Redirecting to login.");
                navigate("/admin-login");
                return;
            }

            try {
                // Fetch admin details
                const adminResponse = await axios.get("http://localhost:5000/getAdminDetails", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserData({
                    username: adminResponse.data.username,
                    email: adminResponse.data.email,
                });

                // Fetch rented vehicles
                const rentedVehiclesResponse = await axios.get("http://localhost:5000/rented-vehicles", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRentedVehicleCount(rentedVehiclesResponse.data.length);

            } catch (error) {
                console.error("Error fetching data:", error);
                navigate("/admin-login");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdminData();
        dispatch(fetchAdminVehiclesOnSale());
    }, [dispatch, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userType');
        localStorage.removeItem("token");
        navigate("/selectUserType");
    };

    if (isLoading || vehiclesLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <NavBar />
            <div className="admin-dashboard-container">
                <Link to="/adminDashBoard" className="active-div">Admin Profile</Link>
                <Link to="/buyers-data">Buyers</Link>
                <Link to="/sellers-data">Sellers</Link>
                <Link to="/rental-company-data">Rental Company</Link>
                <Link to="/vehicles-on-rent">Vehicles on Rent</Link>
                <Link to="/rented-vehicles">Rented Vehicles</Link>
                <Link to="/vehicles-on-sale">Vehicles on Sale</Link>
            </div>

            <div className="admin-profile-body">
                <div>
                    <p><strong>Username:</strong> {userData.username}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <div className="overview-container">
                        <div className="admin-overview">
                            <div className="overview-divs">
                                <h4>{rentedVehicleCount}</h4>
                                <p>Rented Vehicles</p>
                            </div>
                            <div className="overview-divs">
                                <h4>{vehicles.length}</h4>
                                <p>Vehicles on Sale</p>
                            </div>
                        </div>
                    </div>
                    <div className="btn-div">
                        <button onClick={handleLogout} className="admin-logout-btn">Logout</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
