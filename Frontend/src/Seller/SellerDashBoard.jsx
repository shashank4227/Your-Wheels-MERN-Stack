import React, { useEffect, useState } from "react";
import NavBar from "../NavBar";
import "../CSS/BuyerDashBoard.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getSellerDetails } from "../actions/sellerActions"; // Adjust the path as necessary

export default function SellerDashBoard() {
  const [vehicleRentCount, setVehicleRentCount] = useState(0);
  const [vehicleSaleCount, setVehicleSaleCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData, loading: userLoading, error } = useSelector((state) => state.seller);

  
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/seller-login');
        }
      }, [navigate]);

  const fetchVehicleRentCount = async () => {
    try {
      const response = await axios.get("http://localhost:5000/vehicle-count", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setVehicleRentCount(response.data.length);
    } catch (err) {
      console.error("Error fetching vehicle rent count:", err.response?.data?.message || err.message);
    }
  };

  const fetchVehicleSaleCount = async () => {
    try {
      const response = await axios.get("http://localhost:5000/vehicle-sale-count", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setVehicleSaleCount(response.data.vehicleSaleCount);
    } catch (err) {
      console.error("Error fetching vehicle sale count:", err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    dispatch(getSellerDetails());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching seller details:", error);
      navigate("/seller-login");
    }
  }, [error, navigate]);

  useEffect(() => {
    if (!userLoading) {
      fetchVehicleRentCount();
      fetchVehicleSaleCount();
      setIsLoading(false);
    }
  }, [userLoading]);

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("token");
    navigate("/selectUserType");
  };

  const handleUpdate = () => {
    if (userData.id) {
      navigate(`/update-seller/${userData.id}`);
    } else {
      console.error("Seller ID is undefined");
    }
  };

  if (userLoading || isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <NavBar />
      <div className="admin-dashboard-container">
        <Link to="/sellerDashBoard" className="active-div">Seller Profile</Link>
        {!userData.isMember && (
          <Link to="/seller-membership-selection">Take Membership</Link>
        )}
        {userData.isMember && (
          <>
            {userData.membershipType === "sell" && (
              <>
                <Link to="/sell">Sell Vehicles</Link>
                <Link to="/getSellDetails">Vehicles on Sale</Link>
              </>
            )}
            {userData.membershipType === "rent" && (
              <>
                <Link to="/addRent">Add to Rent</Link>
                <Link to="/getRentDetails">Vehicles On Rent</Link>
                <Link to="/booked-vehicles">Booked for Rent</Link>
              </>
            )}
            {userData.membershipType === "sell-rent" && (
              <>
                <Link to="/sell">Sell Vehicles</Link>
                <Link to="/getSellDetails">Vehicles on Sale</Link>
                <Link to="/addRent">Add to Rent</Link>
                <Link to="/getRentDetails">Vehicles On Rent</Link>
                <Link to="/booked-vehicles">Booked for Rent</Link>
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
          <div className="overview-container">
            <div className="admin-overview">
              <div className="overview-divs">
                <h4>{vehicleSaleCount}</h4>
                <p>Vehicles on Sale</p>
              </div>
              <div className="overview-divs">
                <h4>{vehicleRentCount}</h4>
                <p>Vehicles Added to Rent</p>
              </div>
            </div>
          </div>
          <div className="btn-div">
            <button onClick={handleUpdate} style={{ marginRight: "20px" }} className="admin-logout-btn">Update</button>
            <button onClick={handleLogout} className="admin-logout-btn">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}
