import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../CSS/FakePayment.css';
import NavBar from '../NavBar';

const RentalCompanyMembershipPayment = () => {
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        nameOnCard: '',
        billingAddress: '',
    });
    const [paymentStatus, setPaymentStatus] = useState('');
    const [isExpired, setIsExpired] = useState(false); 
    const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
    const navigate = useNavigate();
    const paymentAmount = 1000;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/rental-company-login');
        }
      }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown <= 1) {
                    setIsExpired(true);
                    return 0;
                }
                return prevCountdown - 1;
            });
        }, 1000); 

        const timeout = setTimeout(() => {
            alert("Session Expired");
            navigate("/rental-company-dashboard");
        }, 300000); 

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Card number validation
        if (!formData.cardNumber || formData.cardNumber.length !== 16) {
            setPaymentStatus('Invalid card number.');
            return;
        }
        if (!formData.cvv || !/^\d{3}$/.test(formData.cvv)) {
            setPaymentStatus('Invalid CVV. It should be exactly 3 numerical digits.');
            return;
        }
        // Expiry date validation
        const [month, year] = formData.expiryDate.split('/');
        if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
            setPaymentStatus('Invalid expiry date. Use MM/YY format.');
            return;
        }
        if (
            !formData.cardNumber || 
            formData.cardNumber.length !== 16 || 
            !/^\d{16}$/.test(formData.cardNumber) // Ensure the card number consists of exactly 16 digits
        ) {
            setPaymentStatus('Invalid card number. It should be 16 digits and contain only numbers.');
            return;
        }if (
            !formData.cvv || 
            formData.cvv.length !== 3 || 
            !/^\d{3}$/.test(formData.cvv) // Ensure the CVV consists of exactly 3 digits and only numbers
        ) {
            setPaymentStatus('Invalid CVV. It should be 3 digits and contain only numbers.');
            return;
        }
        const monthInt = parseInt(month, 10);
        const yearInt = parseInt('20' + year, 10); // Convert YY to YYYY

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based
        const currentYear = currentDate.getFullYear();

        if (monthInt < 1 || monthInt > 12) {
            setPaymentStatus('Month should be between 01 and 12.');
            return;
        }

        if (yearInt < currentYear || (yearInt === currentYear && monthInt < currentMonth)) {
            setPaymentStatus('Expiry date cannot be in the past.');
            return;
        }

        // CVV validation
        if (!formData.cvv || formData.cvv.length !== 3) {
            setPaymentStatus('Invalid CVV.');
            return;
        }

        // Ensure all required fields are filled
        if (!formData.billingAddress || !formData.nameOnCard) {
            setPaymentStatus('Please fill all the required fields.');
            return;
        }

        try {
            const username = localStorage.getItem('rental_company_username'); 

            const response = await axios.post('http://localhost:5000/rental-company-payment', {
                ...formData,
                username,
            });

            if (response.status === 200) {
                setPaymentStatus('Payment successful!');
                setTimeout(() => {
                    navigate('/rental-company-dashboard'); 
                }, 2000); 
            }
        } catch (error) {
            console.error('Payment error:', error);
            setPaymentStatus('Payment failed. Please try again.');
        }
    };

    return (
        <div>
            <NavBar />
            <div className='fake-container'>
                <div>
                    {isExpired ? (
                        <div>
                            <h2>Session Expired</h2>
                            <p>Please log in again.</p>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            <h2>Session Expiry Countdown</h2>
                            <p>{formatTime(countdown)} remaining</p>
                            <br />
                        </div>
                    )}
                </div>
                <div className="payment-container">
                    <div className="payment-form-details">
                        <h2>Make Your Payment</h2>
                        <p style={{textAlign:"center",marginTop:"20px",marginBottom:"20px"}}>Payment : 1000</p>
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

export default RentalCompanyMembershipPayment;
