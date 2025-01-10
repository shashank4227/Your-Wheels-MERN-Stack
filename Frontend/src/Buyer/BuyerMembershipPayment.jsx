import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../CSS/FakePayment.css';
import NavBar from '../NavBar';

const BuyerMembershipPayment = () => {
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        nameOnCard: '',
        billingAddress: ''
    });
    const [paymentStatus, setPaymentStatus] = useState('');
    const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
    const [isExpired, setIsExpired] = useState(false);
    const navigate = useNavigate();
    const selectedMembership = localStorage.getItem('selectedMembership'); // Get membership type
    const membershipAmount = selectedMembership === 'buy-rent' ? 1700 : 1000; // Determine price
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/buyer-login');
        }
    }, [navigate]);
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate payment form
        if (!formData.cardNumber || formData.cardNumber.length !== 16) {
            setPaymentStatus('Invalid card number.');
            return;
        }

        // Expiry date validation
        const [month, year] = formData.expiryDate.split('/');

        // Check if the expiry date follows MM/YY format
        if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
            setPaymentStatus('Invalid expiry date. Use MM/YY format.');
            return;
        }

        const monthInt = parseInt(month, 10);
        const yearInt = parseInt('20' + year, 10); // Convert YY to YYYY

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based
        const currentYear = currentDate.getFullYear();

        // Check if month is valid (between 01 and 12)
        if (monthInt < 1 || monthInt > 12) {
            setPaymentStatus('Month should be between 01 and 12.');
            return;
        }
        if (
            !formData.cardNumber || 
            formData.cardNumber.length !== 16 || 
            !/^\d{16}$/.test(formData.cardNumber) // Ensure the card number consists of exactly 16 digits
        ) {
            setPaymentStatus('Invalid card number. It should be 16 digits and contain only numbers.');
            return;
        }
       
        // Check if expiry date is not in the past
        if (yearInt < currentYear || (yearInt === currentYear && monthInt < currentMonth)) {
            setPaymentStatus('Expiry date cannot be in the past.');
            return;
        }
        if (
            !formData.cvv || 
            formData.cvv.length !== 3 || 
            !/^\d{3}$/.test(formData.cvv) // Ensure the CVV consists of exactly 3 digits and only numbers
        ) {
            setPaymentStatus('Invalid CVV. It should be 3 digits and contain only numbers.');
            return;
        }

        if (!formData.cvv || formData.cvv.length !== 3) {
            setPaymentStatus('Invalid CVV.');
            return;
        }
        if (!formData.billingAddress || !formData.nameOnCard) {
            setPaymentStatus('Please fill all the required fields.');
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            setPaymentStatus('User not authenticated. Please log in.');
            return;
        }

        try {
            // Send payment details and membership info to the backend
            await axios.post(
                'http://localhost:5000/addBuyerMembership',
                {
                    billingAddress: formData.billingAddress,
                    cardNumber: formData.cardNumber,
                    expiryDate: formData.expiryDate,
                    cvv: formData.cvv,
                    nameOnCard: formData.nameOnCard,
                    membershipType: selectedMembership, // Include membership type
                    membershipAmount: membershipAmount // Include membership amount
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setPaymentStatus('Payment successful and membership updated!');
            navigate('/buyerDashBoard');
        } catch (error) {
            console.error('Error submitting payment or updating membership:', error);
            setPaymentStatus('Submission failed. Please try again.');
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown <= 1) {
                    setIsExpired(true);
                    return 0; // Prevent negative countdown
                }
                return prevCountdown - 1;
            });
        }, 1000); // Update countdown every second

        const timeout = setTimeout(() => {
            alert("Session Expired");
            navigate("/buyerDashBoard");
        }, 301000); // 5 minutes timeout

        // Cleanup timers on component unmount
        return () => {
            clearInterval(timer);
            clearTimeout(timeout);
        };
    }, [navigate]);

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div>
            <NavBar />
            <div className='fake-container'>
            <div>
                {isExpired ? (
                    <div>
                        <h2>Session Expired</h2>
                        <p style={{textAlign:"center"}}>Payment session expired.</p>
                    </div>
                ) : (
                    <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                        <h2>Session Expiry Countdown</h2>
                        <p>{formatTime(countdown)} remaining</p>
                        <br />
                    </div>
                )}
            </div>
                <div className="payment-container">
                    <div className="payment-form-details">
                        <h2>Make Your Payment to get Membership</h2><br/>
                        <p style={{textAlign:"center"}}>Membership Amount: {membershipAmount}</p><br/> {/* Show membership amount */}

                        <form onSubmit={handleSubmit} className="payment-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="cardNumber">Card Number:</label>
                                    <input
                                        id="cardNumber"
                                        name="cardNumber"
                                        type="text"
                                        value={formData.cardNumber}
                                        onChange={handleInputChange}
                                        placeholder="1234 5678 9012 3456"
                                        maxLength="16"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="expiryDate">Expiry Date:</label>
                                    <input
                                        id="expiryDate"
                                        name="expiryDate"
                                        type="text"
                                        value={formData.expiryDate}
                                        onChange={handleInputChange}
                                        placeholder="MM/YY"
                                        maxLength="5"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="cvv">CVV:</label>
                                    <input
                                        id="cvv"
                                        name="cvv"
                                        type="text"
                                        value={formData.cvv}
                                        onChange={handleInputChange}
                                        placeholder="123"
                                        maxLength="3"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nameOnCard">Name on Card:</label>
                                    <input
                                        id="nameOnCard"
                                        name="nameOnCard"
                                        type="text"
                                        value={formData.nameOnCard}
                                        onChange={handleInputChange}
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="billingAddress">Billing Address:</label>
                                <input
                                    id="billingAddress"
                                    name="billingAddress"
                                    type="text"
                                    value={formData.billingAddress}
                                    onChange={handleInputChange}
                                    placeholder="1234 Street, City, Country"
                                />
                            </div>

                            <button type="submit" className="submit-button">Pay Now</button>
                        </form>

                        {paymentStatus && <div className="payment-status">{paymentStatus}</div>}
                    </div>
                    
                    <div className="payment-image-container">
                        <img
                            src="payment-pic.jpg" 
                            alt="Payment Illustration"
                            className="payment-pic"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerMembershipPayment;
