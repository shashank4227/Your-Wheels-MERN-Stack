import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../NavBar";
import { getSellerDetails } from "../actions/sellerActions"; // Adjust the path as necessary
import BookedVehicleCardCompany from "../Cards/BookedVehicleCardCompany"; // Add your vehicle card component
import axios from "axios";

export default function BookedVehiclesCompany() {
    const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookedVehicles, setBookedVehicles] = useState([]);
  const [isMember, setIsMember] = useState(false);

    
    
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/rental-company-login');
    }
  }, [navigate]);
  useEffect(() => {
    const fetchRentalCompanyDetails = async () => {
        try {
            const response = await axios.get('http://localhost:5000/rentalcompanydetails', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` // Pass token for auth
                }
            });
            setIsMember(response.data.isMember);
        } catch (error) {
            console.error("Error fetching rental company details:", error);
            if (error.response && error.response.status === 401) {
                navigate('/login'); // Redirect to login if unauthorized
            }
        }
    };

    fetchRentalCompanyDetails();
}, [navigate]);


  // Fetch booked vehicles
  useEffect(() => {
    const getBookedVehicles = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(
          "http://localhost:5000/get-booked-vehicles-of-company",
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


  return (
    <>
      <NavBar />
      <div className="admin-dashboard-container">
                <Link to="/rental-company-dashboard" >Rental Company Profile</Link>
                {isMember ? 
                    <>
                        <Link to="/addrentbycompany">Add Vehicles to Rent</Link>
                      <Link to="/getRentDetailsByCompany">Vehicles Added to Rent</Link>
                      <Link to="/booked-vehicles-company" className="active-div">Booked Vehicles</Link>
                      
                    </>
                    : 
                    <Link to="/rental-company-membership-selection">Take Membership</Link>
                }
        </div>
      <div className="rent-results-container">
        <div className="rent-cards-container">
          {loading ? (
            <p>Loading vehicles...</p>
          ) : bookedVehicles.length > 0 ? (
            bookedVehicles.map((vehicle) => (
              <BookedVehicleCardCompany key={vehicle._id} vehicle={vehicle} />
            ))
          ) : (
            <p>No vehicles are booked.</p>
          )}
        </div>
      </div>
    </>
  );
}
