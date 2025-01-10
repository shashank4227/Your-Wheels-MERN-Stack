import React, { useEffect, useState } from 'react';
import NavBar from '../NavBar';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/AdminDashBoard.css';
import '../CSS/BoughtVehicles.css';
import axios from 'axios';

export default function BuyersData() {
    const [buyers, setBuyers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [buyersCount, setBuyersCount] = useState(0);
    const [membershipBuyersCount, setMembershipBuyersCount] = useState(0);
    const [revenueByBuyer, setRevenueByBuyer] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
  if (!token) {
    navigate('/admin-login');
  }
        const fetchData = async () => {
            try {
                // Fetching buyers count with membership and revenue data
                const { data: buyersData } = await axios.get('http://localhost:5000/buyers-count-with-membership-details');
                setBuyersCount(buyersData.buyersCount);
                setMembershipBuyersCount(buyersData.membershipBuyers);
                setRevenueByBuyer(buyersData.totalAmount);

                // Fetching buyers data
                const { data: buyersList } = await axios.get('http://localhost:5000/buyers-data');
                
                // For each buyer, fetch the rented vehicles count
                const buyersWithCounts = await Promise.all(buyersList.map(async (buyer) => {
                    const { data: countData } = await axios.get(`http://localhost:5000/rented-vehicles-count/${buyer.buyer_username}`);
                    return {
                        ...buyer,
                        rentedCount: countData.rentedCount || 0, // Add rented count to the buyer
                    };
                }));

                setBuyers(buyersWithCounts);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false); // Stop the loading spinner
            }
        };

        fetchData();
    }, []);

    const [deleteId, setDeleteId] = useState(null); // Track which buyer is being deleted

    const handleDeleteBuyer = async (buyerId) => {
        try {
            const response = await fetch(`http://localhost:5000/buyers-data/${buyerId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setBuyers(buyers.filter(buyer => buyer._id !== buyerId));
                setDeleteId(null); // Reset deleteId after deletion
            } else {
                const data = await response.json();
                console.error('Error deleting buyer:', data.message);
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleUpdateBuyer = (buyerId) => {
        navigate(`/update-buyer/${buyerId}`); // Navigate to buyer update page
    };

    return (
        <div>
            <NavBar />
            <div className="admin-dashboard-container">
                <Link to="/adminDashBoard">Admin Profile</Link>
                <Link to="/buyers-data" className="active-div">Buyers</Link>
                <Link to="/sellers-data">Sellers</Link>
                <Link to="/rental-company-data">Rental Company</Link>
                <Link to="/vehicles-on-rent">Vehicles on Rent</Link>
                <Link to="/rented-vehicles">Rented Vehicles</Link>
                <Link to="/vehicles-on-sale">Vehicles on Sale</Link>
            </div>
            <div className="overview-container">
                <div className='admin-overview'>
                    <div className='overview-divs'>
                        <h4>{buyersCount}</h4>
                        <p>Number of Buyers</p>
                    </div>
                    <div className='overview-divs'>
                        <h4>{membershipBuyersCount}</h4>
                        <p>Buyers with Memberships</p>
                    </div>
                    <div className='overview-divs'>
                        <h4>₹{revenueByBuyer}</h4>
                        <p>Revenue Generated</p>
                    </div>
                </div>
            </div>

            <div className="body-div">
                <div>
                    <Link to="/addBuyerByAdmin" className='create-btn'>Create a Buyer</Link>
                </div>
                <p style={{ marginTop: "50px" }}>List of registered buyers</p>
                {loading ? (
                    <p>Loading buyers...</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Buyer Username</th>
                                <th>Email</th>
                                <th>Membership</th>
                                <th>Rented Vehicles</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buyers.length > 0 ? (
                                buyers.map(buyer => (
                                    <tr key={buyer._id}>
                                        <td>{buyer.buyer_username}</td>
                                        <td>{buyer.buyer_email}</td>
                                        <td>{buyer.isMember ? 'Member' : 'Not a Member'}</td>
                                        <td>{buyer.rentedCount}</td>
                                        <td>
                                            <button onClick={() => handleUpdateBuyer(buyer._id)} className='update-btn' style={{ marginRight: "30px" }}>Update</button>
                                            {deleteId === buyer._id ? (
                                                <>
                                                    <button onClick={() => handleDeleteBuyer(buyer._id)} className='delete-btn' style={{ marginRight: "10px" }}>Confirm</button>
                                                    <button onClick={() => setDeleteId(null)} className='cancel-btn'>Cancel</button>
                                                </>
                                            ) : (
                                                <button onClick={() => setDeleteId(buyer._id)} className='delete-btn'>Delete</button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No buyers found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
