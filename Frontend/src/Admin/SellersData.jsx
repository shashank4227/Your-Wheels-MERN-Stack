import React, { useEffect, useState } from 'react';
import NavBar from '../NavBar';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/AdminDashBoard.css';
import '../CSS/BoughtVehicles.css';
import axios from 'axios';


export default function SellersData() {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sellersCount, setSellersCount] = useState(0);
    const [revenueBySeller, setRevenueBySeller] = useState(0);
    const [membershipSellersCount, setMembershipSellersCount] = useState(0);
    const navigate = useNavigate(); // For navigation to update page


    

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          // Redirect to login if no token is present
          navigate('/admin-login');
        }
        const fetchSellersCount = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/sellers-count-with-membership-details');
    
                setSellersCount(data.sellerCount);              // Setting the total buyers count
                setRevenueBySeller(data.totalAmount);
                setMembershipSellersCount(data.membershipSeller); // Setting the count of buyers with membership
            } catch (err) {
                console.log("Error occurred:", err);
            }
        };

        fetchSellersCount();


        const fetchSellers = async () => {
            try {
                const response = await fetch('http://localhost:5000/sellers-data', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setSellers(data);
                } else {
                    console.error('Error fetching sellers:', data.message);
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false); // Stop the loading spinner
            }
        };

        fetchSellers();
    }, []);

    const [deleteId, setDeleteId] = useState(null); // Track which seller is being deleted

const handleDeleteSeller = async (sellerId) => {
    try {
        const response = await fetch(`http://localhost:5000/sellers-data/${sellerId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            setSellers(sellers.filter(seller => seller._id !== sellerId));
            setDeleteId(null); // Reset deleteId after deletion
        } else {
            const data = await response.json();
            console.error('Error deleting seller:', data.message);
        }
    } catch (err) {
        console.error('Error:', err);
    }
};


    const handleUpdateSeller = (sellerId) => {
        navigate(`/update-seller/${sellerId}`);
    };

    return (
        <div>
            <NavBar />
            <div className="admin-dashboard-container">
                <Link to="/adminDashBoard">Admin Profile</Link>
                <Link to="/buyers-data">Buyers</Link>
                <Link to="/sellers-data" className="active-div">Sellers</Link>
                <Link to="/rental-company-data">Rental Company</Link>
                <Link to="/vehicles-on-rent">Vehicles on Rent</Link>
                <Link to="/rented-vehicles">Rented Vehicles</Link>
                <Link to="/vehicles-on-sale">Vehicles on Sale</Link>
            </div>
            <div className="overview-container">
            <div className='admin-overview'>
                <div className='overview-divs'>
                        <h4>{sellersCount}</h4>
                    <p>Number of Sellers</p>
                </div>
                <div className='overview-divs'>
                        <h4>{membershipSellersCount}</h4>
                    <p>Sellers with Memberships</p>
                </div>
                <div className='overview-divs'>
                        <h4>₹{revenueBySeller}</h4>
                    <p>Revenue Generated</p>
                </div>
            </div>
            </div>
            <div className="body-div">
                <div>
                    <Link to="/addSellerByAdmin" className='create-btn'>Create a Seller</Link>
                </div>
                <p style={{ marginTop: "50px" }}>List of registered sellers</p>
                {loading ? (
                    <p>Loading sellers...</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Seller Username</th>
                                <th>Email</th>
                                <th>Membership</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sellers.length > 0 ? (
                                sellers.map(seller => (
                                    <tr key={seller._id}>
                                        <td>{seller.seller_username}</td>
                                        <td>{seller.seller_email}</td>
                                        <td>{seller.isMember ? 'Member' : 'Not a Member'}</td>
                                        <td>
    <button onClick={() => handleUpdateSeller(seller._id)} className='update-btn' style={{ marginRight: "30px" }}>Update</button>
    {deleteId === seller._id ? (
        <>
            <button onClick={() => handleDeleteSeller(seller._id)} className='delete-btn' style={{ marginRight: "10px" }}>Confirm</button>
            <button onClick={() => setDeleteId(null)} className='cancel-btn'>Cancel</button>
        </>
    ) : (
        <button onClick={() => setDeleteId(seller._id)} className='delete-btn'>Delete</button>
    )}
</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No sellers found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
