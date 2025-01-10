import NavBar from "../NavBar";
import '../CSS/BuyerDashBoard.css';
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function RentalCompanyDashBoard() {
    const [userData, setUserData] = useState({});
    const [vehicleRentCount, setVehicleRentCount] = useState(0); // Updated to vehicleRentCount
    const [isMember, setIsMember] = useState(false);
    const [id, setID] = useState("");
    const navigate = useNavigate();

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
                setUserData(response.data);
                setIsMember(response.data.isMember);
                setVehicleRentCount(response.data.vehicleRentCount || 0); // Use vehicleRentCount
                setID(response.data.id);
            } catch (error) {
                console.error("Error fetching rental company details:", error);
                if (error.response && error.response.status === 401) {
                    navigate('/login'); // Redirect to login if unauthorized
                }
            }
        };
    
        fetchRentalCompanyDetails();
    }, [navigate]);
    
    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token
        navigate('/selectUserType'); // Redirect to login page
    };
    
    const handleUpdate = () => {
        console.log(userData);
        console.log("Updating rental company with ID:", id); // Debugging line
        if (userData.id) {
            navigate(`/update-rental-company/${id}`);
        } else {
            console.error("Rental Company ID is undefined");
        }
    };

    return (
        <div>
            <NavBar />
            <div className="admin-dashboard-container">
                <Link to="/rental-company-dashboard" className="active-div">Rental Company Profile</Link>
                {isMember ? 
                    <>
                        <Link to="/addrentbycompany">Add Vehicles to Rent</Link>
                        <Link to="/getRentDetailsByCompany">Vehicles Added to Rent</Link>
                        <Link to="/booked-vehicles-company">Booked Vehicles</Link>

                    </>
                    : 
                    <Link to="/rental-company-membership-selection">Take Membership</Link>
                }
            </div>
              
            <div className="admin-profile-body">
                <div>
                    <p><strong>Username:</strong> {userData.username}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                   {isMember ? <p><strong>Membership :</strong> Active</p>: null}
                    <div className='overview-container'>
                        <div className='admin-overview'>
                            <div className='overview-divs'>
                                <h4>{vehicleRentCount}</h4> 
                                <p>Vehicles Added to Rent</p>
                            </div>
                        </div>
                    </div>
                    <div className='btn-div'>
                        <button onClick={handleUpdate} style={{marginRight:"20px"}} className='admin-logout-btn'>Update</button>
                        <button onClick={handleLogout} className='admin-logout-btn'>Logout</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
