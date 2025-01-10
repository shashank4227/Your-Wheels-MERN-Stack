import React, { useEffect, useState } from "react";
import NavBar from "../NavBar";
import { Link, useNavigate } from "react-router-dom";
import SellerRentDetails from "../Cards/SellerRentDetails";
import { useDispatch, useSelector } from "react-redux";
import { getSellerDetails } from "../actions/sellerActions"; // Adjust path if necessary

export default function GetRentDetails() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData, loading: userLoading, error } = useSelector((state) => state.seller);

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
    const fetchVehicles = async () => {
      try {
        const response = await fetch("http://localhost:5000/vehicles-by-seller", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setVehicles(data);
        } else {
          console.error("Error fetching vehicles:", data.message);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (userLoading) {
    return <p>Loading seller details...</p>;
  }

  return (
    <div>
      <NavBar />
      <div className="admin-dashboard-container">
        <Link to="/seller-dashBoard">Seller Profile</Link>
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
                <Link to="/getRentDetails" className="active-div">Vehicles On Rent</Link>
                <Link to="/booked-vehicles">Booked for Rent</Link>
              </>
            )}
            {userData.membershipType === "sell-rent" && (
              <>
                <Link to="/sell">Sell Vehicles</Link>
                <Link to="/getSellDetails">Vehicles on Sale</Link>
                <Link to="/addRent">Add to Rent</Link>
                <Link to="/getRentDetails" className="active-div">Rented Vehicles</Link>
                <Link to="/booked-vehicles">Booked for Rent</Link>
              </>
            )}
          </>
        )}
      </div>
      <div className="rent-results-container">
        <div className="rent-cards-container">
          {loading ? (
            <p>Loading vehicles...</p>
          ) : vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <SellerRentDetails key={vehicle._id} vehicle={vehicle} />
            ))
          ) : (
            <p>No vehicles found matching your criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
}
