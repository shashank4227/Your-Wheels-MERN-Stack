import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../NavBar";
import { getSellerDetails } from "../actions/sellerActions"; // Adjust the path as necessary
import BookedVehicleCard from "../Cards/BookedVehicleCard"; // Add your vehicle card component

export default function BookedVehicles() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData, loading: userLoading, error } = useSelector(
    (state) => state.seller
  );
  const [loading, setLoading] = useState(true);
  const [bookedVehicles, setBookedVehicles] = useState([]);

  // Fetch seller details when the component mounts
  useEffect(() => {
    dispatch(getSellerDetails());
  }, [dispatch]);

  // Fetch booked vehicles
  useEffect(() => {
    const getBookedVehicles = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(
          "http://localhost:5000/get-booked-vehicles",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setBookedVehicles(data);
        } else {
          console.error("Error fetching vehicles:", data.message);
        }
      } catch (err) {
        console.error("Error fetching booked vehicles:", err);
      } finally {
        setLoading(false);
      }
    };
    getBookedVehicles();
  }, []);

  // Display loading state if seller details are loading
  if (userLoading) {
    return <p>Loading seller details...</p>;
  }

  return (
    <>
      <NavBar />
      <div className="admin-dashboard-container">
        <Link to="/seller-dashBoard">Seller Profile</Link>
        {!userData?.isMember && (
          <Link to="/seller-membership-selection">Take Membership</Link>
        )}
        {userData?.isMember && (
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
                <Link to="/booked-vehicles" className="active-div">
                  Booked for Rent
                </Link>
              </>
            )}
            {userData.membershipType === "sell-rent" && (
              <>
                <Link to="/sell">Sell Vehicles</Link>
                <Link to="/getSellDetails">Vehicles on Sale</Link>
                <Link to="/addRent">Add to Rent</Link>
                <Link to="/getRentDetails">Vehicles On Rent</Link>
                <Link to="/booked-vehicles" className="active-div">
                  Booked for Rent
                </Link>
              </>
            )}
          </>
        )}
      </div>
      <div className="rent-results-container">
        <div className="rent-cards-container">
          {loading ? (
            <p>Loading vehicles...</p>
          ) : bookedVehicles.length > 0 ? (
            bookedVehicles.map((vehicle) => (
              <BookedVehicleCard key={vehicle._id} vehicle={vehicle} />
            ))
          ) : (
            <p>No vehicles are booked.</p>
          )}
        </div>
      </div>
    </>
  );
}
