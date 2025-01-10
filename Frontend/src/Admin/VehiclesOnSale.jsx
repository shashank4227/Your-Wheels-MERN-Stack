import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "../NavBar";
import { Link,useNavigate } from "react-router-dom";
import { fetchAdminVehiclesOnSale } from "../actions/adminActions";
import "../CSS/AdminDashBoard.css";

export default function VehiclesOnSale() {
  const dispatch = useDispatch();

  // Access Redux state for vehicles on sale
  const adminVehiclesState = useSelector((state) => state.adminVehiclesOnSale);
  const { loading, vehicles, error } = adminVehiclesState;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin-login');
    }
}, [navigate]);

  // Fetch vehicles on sale when the component mounts
  useEffect(() => {
    dispatch(fetchAdminVehiclesOnSale());
  }, [dispatch]);

  return (
    <div>
      <NavBar />
      <div className="admin-dashboard-container">
        <Link to="/adminDashBoard">Admin Profile</Link>
        <Link to="/buyers-data">Buyers</Link>
        <Link to="/sellers-data">Sellers</Link>
        <Link to="/rental-company-data">Rental Company</Link>
        <Link to="/vehicles-on-rent">Vehicles on Rent</Link>
        <Link to="/rented-vehicles">Rented Vehicles</Link>
        <Link to="/vehicles-on-sale" className="active-div">
          Vehicles on Sale
        </Link>
      </div>
      <div className="body-div">
        <p>Browse through an extensive list of vehicles that are on sale</p>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Seller Username</th>
                <th>Vehicle Type</th>
                <th>Location</th>
                <th>Fuel Type</th>
                <th>Seller Email</th>
                <th>Registration Year</th>
                <th>Vehicle Company</th>
                <th>Vehicle Model</th>
                <th>Selling Price</th>
                <th>Contact Number</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.length > 0 ? (
                vehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td>{vehicle.seller_username}</td>
                    <td>{vehicle.vehicleType}</td>
                    <td>{vehicle.location}</td>
                    <td>{vehicle.fuelType}</td>
                    <td>{vehicle.seller_email}</td>
                    <td>{vehicle.registrationYear}</td>
                    <td>{vehicle.vehicleCompany}</td>
                    <td>{vehicle.vehicleModel}</td>
                    <td>{vehicle.sellingPrice}</td>
                    <td>{vehicle.contactNumber}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10">No vehicles available for sale</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
