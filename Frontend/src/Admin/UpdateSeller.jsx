import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';
import { Link } from 'react-router-dom';

export default function UpdateSeller() {
    const { id } = useParams(); // Get seller id from URL
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/admin-login');
        }
    }, [navigate]);
    
    const [seller, setSeller] = useState({
        seller_username: '',
        seller_email: '',
        isMember: false,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch seller details based on the ID
        const fetchSellerDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/sellers-data/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setSeller(data);
                } else {
                    console.error('Error fetching seller details:', data.message);
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSellerDetails();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSeller(prevSeller => ({
            ...prevSeller,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5000/update-seller/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(seller),
            });
            const userType = localStorage.getItem('userType');

            if (response.ok) {
                alert('Seller details updated successfully');
                
                if (userType === 'seller') {
                    navigate('/seller-dashBoard'); // Redirect to buyers list after successful update
                        
                    } else {
                    navigate('/sellers-data'); // Redirect to buyers list after successful update
                        
                    }
            } else {
                const data = await response.json();
                console.error('Error updating seller:', data.message);
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
        <div style={{backgroundColor:"white",marginTop:"100px",height:"400px",borderRadius:"10px", width:"600px",display:"flex",flexDirection:"column", justifyContent:"center",alignItems:"center"}}>
            <h2>Update Seller Details</h2>
            {loading ? (
                <p>Loading seller details...</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            name="seller_username"
                            value={seller.seller_username}
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
                            name="seller_email"
                            value={seller.seller_email}
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
                            checked={seller.isMember}
                            style={{ marginTop: "20px", width:"20px"}}
                            onChange={handleChange}
                        />
                    </div> */}
                    <button type="submit" style={{backgroundColor:"blueviolet"}}>Update Seller</button>
                </form>
            )}
                </div>
                </div>
                </div>
            </div>
    );
}
