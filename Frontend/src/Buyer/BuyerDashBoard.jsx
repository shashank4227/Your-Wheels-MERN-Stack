import React, { useEffect, useState } from 'react';
import NavBar from "../NavBar";
import '../CSS/BuyerDashBoard.css';
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getBuyerDetails } from '../actions/buyerActions'; // Import Redux action

export default function BuyerDashBoard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Use Redux state for user data
    const buyerState = useSelector((state) => state.buyer);
    const { loading, userData, error } = buyerState;

    const [rentedVehicleCount, setRentedVehicleCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found. Redirecting to login.");
            navigate("/buyer-login");
            return;
        }

        dispatch(getBuyerDetails()); // Dispatch the action to fetch buyer details

        // Fetch rented vehicles count
        const fetchRentedVehicleCount = async () => {
            try {
                const response = await fetch("http://localhost:5000/count-rented-vehicles-by-buyer", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                setRentedVehicleCount(data.rentedVehicleCount);
            } catch (error) {
                console.error("Error fetching rented vehicles count:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRentedVehicleCount();
    }, [dispatch, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("userType");
        localStorage.removeItem("token");
        navigate("/selectUserType");
    };

    const handleUpdate = () => {
        if (userData?.id) {
            navigate(`/update-buyer/${userData.id}`);
        } else {
            console.error("Buyer ID is undefined");
        }
    };

    if (loading || isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading user data: {error}</div>;
    }

    return (
        <div>
            <NavBar />
            <div className="admin-dashboard-container">
                <Link to="/buyerDashBoard" className="active-div">Buyer Profile</Link>
                {!userData.isMember && (
                    <Link to="/buyer-membership-selection">Take Membership</Link>
                )}
                {userData.isMember && (
                    <>
                        {userData.membershipType === "buy" && <Link to="/buy">Buy Vehicles</Link>}
                        {userData.membershipType === "rent" && (
                            <>
                                <Link to="/rent">Rent Vehicles</Link>
                                <Link to="/buyerRentedVehicles">Rented Vehicles</Link>
                            </>
                        )}
                        {userData.membershipType === "buy-rent" && (
                            <>
                                <Link to="/buy">Buy Vehicles</Link>
                                <Link to="/rent">Rent Vehicles</Link>
                                <Link to="/buyerRentedVehicles">Rented Vehicles</Link>
                            </>
                        )}
                    </>
                )}
            </div>

            <div className="admin-profile-body">
                <div>
                    <p><strong>Username:</strong> {userData.username}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Membership Type:</strong> {userData.membershipType || "None"}</p>
                    <p><strong>Membership Amount:</strong> ${userData.membershipAmount || "0.00"}</p>
                    <div className='overview-container'>
                        <div className='admin-overview'>
                            <div className='overview-divs'>
                                <h4>{rentedVehicleCount}</h4>
                                <p>Rented Vehicles</p>
                            </div>
                        </div>
                    </div>
                    <div className='btn-div'>
                        <button onClick={handleUpdate} style={{ marginRight: "20px" }} className='admin-logout-btn'>Update</button>
                        <button onClick={handleLogout} className='admin-logout-btn'>Logout</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
