import React, { useEffect, useState } from 'react';
import NavBar from '../NavBar';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/AdminDashBoard.css';
import '../CSS/BoughtVehicles.css';
import axios from 'axios';

export default function RentalCompaniesData() {
    const [rentalCompanies, setRentalCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rentalCompanyCount, setRentalCompaniesCount] = useState(0);
    const [membershipRentalCompanyCount, setMembershipRentalCompaniesCount] = useState(0);
    const [totalAmount, setRevenueByRentalCompanies] = useState(0);
    const [companyToDelete, setCompanyToDelete] = useState(null); // Track which company is being deleted
    const navigate = useNavigate(); // For navigation to update page

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/admin-login');
        }
        const fetchRentalCompanies = async () => {

            const { data: rentalCompaniesData } = await axios.get('http://localhost:5000/rental-companies-count-with-membership-details');
            setRentalCompaniesCount(rentalCompaniesData.rentalCompanyCount);
            setMembershipRentalCompaniesCount(rentalCompaniesData.membershipRentalCompany);
            setRevenueByRentalCompanies(rentalCompaniesData.totalAmount);



            const fetchRentalCompanyCount = async () => {
                try {
                    const { data } = await axios.get('http://localhost:5000/rental-company-count-with-membership-details');
        
                    setRentalCompanyCount(data.rentalCompanyCount);              // Setting the total buyers count
                    setMembershipRentalCompanyCount(data.membershipRentalCompany); // Setting the count of buyers with membership
                } catch (err) {
                    console.log("Error occurred:", err);
                }
            };

            fetchRentalCompanyCount();



            try {
                const response = await fetch('http://localhost:5000/rental-company-data', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    const companiesWithCounts = await Promise.all(data.map(async (company) => {
                        const countResponse = await fetch(`http://localhost:5000/rented-vehicles-count-by-company-users/${company.username}`);
                        const countData = await countResponse.json();
                        console.log(countData);

                        return {
                            ...company,
                            rentedCount: countData.rentedCount || 0,
                        };
                    }));

                    setRentalCompanies(companiesWithCounts);
                } else {
                    console.error('Error fetching rental companies:', data.message);
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false); // Stop the loading spinner
            }
        };

        fetchRentalCompanies();
    }, []);
const [deleteId, setDeleteId] = useState(null); // Track which buyer is being deleted


    const handleDeleteCompany = async (companyId) => {
        try {
            const response = await fetch(`http://localhost:5000/rental-company-data/${companyId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setRentalCompanies(rentalCompanies.filter(company => company._id !== companyId));
                setDeleteId(null); // Reset deleteId after deletion
            } else {
                const data = await response.json();
                console.error('Error deleting rental company:', data.message);
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };
    const handleUpdateCompany = (companyId) => {
        navigate(`/update-rental-company/${companyId}`);
    };

    const confirmDelete = (companyId) => {
        setCompanyToDelete(companyId); // Set the company to be deleted
    };

    const cancelDelete = () => {
        setCompanyToDelete(null); // Reset the delete confirmation state
    };

    return (
        <div>
            <NavBar />
            <div className="admin-dashboard-container">
                <Link to="/adminDashBoard">Admin Profile</Link>
                <Link to="/buyers-data">Buyers</Link>
                <Link to="/sellers-data">Sellers</Link>
                <Link to="/rental-company-data" className="active-div">Rental Company</Link>
                <Link to="/vehicles-on-rent">Vehicles on Rent</Link>
                <Link to="/rented-vehicles">Rented Vehicles</Link>
                <Link to="/vehicles-on-sale">Vehicles on Sale</Link>
            </div>
            <div className="overview-container">
            <div className='admin-overview'>
                <div className='overview-divs'>
                        <h4>{rentalCompanyCount}</h4>
                    <p>Number of Rental Companies</p>
                </div>
                <div className='overview-divs'>
                        <h4>{membershipRentalCompanyCount}</h4>
                    <p>Rental Companies with Memberships</p>
                </div>
                <div className='overview-divs'>
                        <h4>₹{totalAmount}</h4>
                    <p>Revenue Generated</p>
                </div>
            </div>
            </div>
            <div className="body-div">
                <div>
                    <Link to="/addCompanyByAdmin" className='create-btn'>Create a Rental Company</Link>
                </div>
                <p style={{ marginTop: "50px" }}>List of registered rental companies</p>
                {loading ? (
                    <p>Loading rental companies...</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Rental Company Username</th>
                                <th>Email</th>
                                <th>Membership</th>
                                <th>Added Vehicles to Rent</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rentalCompanies.length > 0 ? (
                                rentalCompanies.map(company => (
                                    <tr key={company._id}>
                                        <td>{company.username}</td>
                                        <td>{company.email}</td>
                                        <td>{company.isMember ? 'Member' : 'Not a Member'}</td>
                                        <td>{company.rentedCount}</td>
                                        <td>
                                            <button onClick={() => handleUpdateCompany(company._id)} className='update-btn' style={{ marginRight: "30px" }}>Update</button>
                                            {deleteId === company._id ? (
                                                <>
                                                    <button onClick={() => handleDeleteCompany(company._id)} className='delete-btn' style={{ marginRight: "10px" }}>Confirm</button>
                                                    <button onClick={() => setDeleteId(null)} className='cancel-btn'>Cancel</button>
                                                </>
                                            ) : (
                                                <button onClick={() => setDeleteId(company._id)} className='delete-btn'>Delete</button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No rental companies found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
