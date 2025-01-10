import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';
import { Link } from 'react-router-dom';

export default function UpdateRentalCompany() {
    const { id } = useParams(); // Get rental company id from URL
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/admin-login');
        }
      }, [navigate]);
    const [rentalCompany, setRentalCompany] = useState({
        username: '',
        email: '',
        isMember: false,
    });
    const [loading, setLoading] = useState(true);
    const [updateSuccess, setUpdateSuccess] = useState(false); // State for showing update success message

    useEffect(() => {
        // Fetch rental company details based on the ID
        const fetchRentalCompanyDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/rental-company-data-by-admin/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setRentalCompany(data);
                } else {
                    console.error('Error fetching rental company details:', data.message);
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRentalCompanyDetails();
    }, [id]);

    const handleChange = (e) => {
        const { name, value} = e.target;
        setRentalCompany(prevCompany => ({
            ...prevCompany,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5000/update-rental-company/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rentalCompany),
            });

            if (response.ok) {
                setUpdateSuccess(true); // Show success message
            const userType = localStorage.getItem('userType');

                // Delay the navigation by 2 seconds to show the update message
                setTimeout(() => {
                    if (userType === 'rental_company') {
                        navigate('/rental-company-dashboard'); // Redirect to buyers list after successful update
                            
                        } else {
                        navigate('/rental-company-data'); // Redirect to buyers list after successful update
                            
                        }
                }, 2000);
            } else {
                const data = await response.json();
                console.error('Error updating rental company:', data.message);
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    return (
        <div>
            <NavBar />
            <div>
                
                <div style={{ backgroundColor: "blueviolet", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ backgroundColor: "white",marginTop:"100px", height: "400px", borderRadius: "10px", width: "600px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <h2>Update Rental Company Details</h2>
                        {loading ? (
                            <p>Loading rental company details...</p>
                        ) : updateSuccess ? (
                            <p style={{ color: 'green' }}>Details updated successfully! Redirecting...</p>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label>Username:</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={rentalCompany.username}
                                        style={{ marginTop: "20px" }}
                                        onChange={handleChange}
                                        placeholder='Update Username'
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={rentalCompany.email}
                                        onChange={handleChange}
                                        required
                                        style={{ marginTop: "20px" }}
                                        placeholder='Update Email'
                                    />
                                </div>
                                {/* <div>
                                    <label>Is Member:</label>
                                    <input
                                        type="checkbox"
                                        name="isMember"
                                        checked={rentalCompany.isMember}
                                        style={{ marginTop: "20px", width: "20px" }}
                                        onChange={handleChange}
                                    />
                                </div> */}
                                <button type="submit" style={{ backgroundColor: "blueviolet" }}>Update Rental Company</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
     