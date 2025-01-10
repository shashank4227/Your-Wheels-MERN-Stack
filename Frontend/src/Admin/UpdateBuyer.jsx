import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';
import { Link } from 'react-router-dom';
export default function UpdateBuyer() {
    const { id } = useParams(); // Get buyer id from URL
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/admin-login');
        }
    }, [navigate]);
    
    const [buyer, setBuyer] = useState({
        buyer_username: '',
        buyer_email: '',
        isMember: false,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch buyer details based on the ID
        const fetchBuyerDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/buyers-data/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setBuyer(data);
                } else {
                    console.error('Error fetching buyer details:', data.message);
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBuyerDetails();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setBuyer(prevBuyer => ({
            ...prevBuyer,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5000/update-buyer/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(buyer),
            });
            const userType = localStorage.getItem('userType');

            if (response.ok) {
                alert('Buyer details updated successfully');
                if (userType === 'buyer') {
                navigate('/buyerDashBoard'); // Redirect to buyers list after successful update
                    
                } else {
                navigate('/buyers-data'); // Redirect to buyers list after successful update
                    
                }
            } else {
                const data = await response.json();
                console.error('Error updating buyer:', data.message);
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    return (
        <div>
            <NavBar />
            
            <div >
           
                <div style={{backgroundColor:"blueviolet",height:"100vh",display:"flex",justifyContent:"center",alignItems:"center"}}>
        <div style={{backgroundColor:"white",marginTop:"100px", height:"400px",borderRadius:"10px", width:"600px",display:"flex",flexDirection:"column", justifyContent:"center",alignItems:"center"}}>
            <h2>Update Buyer Details</h2>
            {loading ? (
                <p>Loading buyer details...</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            name="buyer_username"
                            value={buyer.buyer_username}
                                            style={{marginTop:"20px"}}
                                            onChange={handleChange}
                                            placeholder='Update Username'
                            required
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="buyer_email"
                            value={buyer.buyer_email}
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
                            checked={buyer.isMember}
                                            style={{ marginTop: "20px",width:"20px"}}
                                            
                                            onChange={handleChange}
                        />
                    </div> */}
                    <button type="submit" style={{backgroundColor:"blueviolet"}}>Update Buyer</button>
                </form>
            )}
                </div>
                </div>
                </div>
            </div>
    );
}
