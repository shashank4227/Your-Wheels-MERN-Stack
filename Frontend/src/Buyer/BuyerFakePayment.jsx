import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import '../CSS/FakePayment.css';
import NavBar from '../NavBar';
import { getBuyerDetails } from '../actions/buyerActions';

export default function FakePayment()  {
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        nameOnCard: '',
        billingAddress: ''
    });
    const [paymentStatus, setPaymentStatus] = useState('');
    const [vehicle, setVehicle] = useState({});
    const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
    const [isExpired, setIsExpired] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const buyerState = useSelector((state) => state.buyer);
    const { userData: buyerDetails, error } = buyerState;

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedVehicle = localStorage.getItem('vehicleDetails');

        if (!storedToken) {
            console.error('No token found. Redirecting to login.');
            navigate('/buyer-login');
            return;
        }

        dispatch(getBuyerDetails());

        if (storedVehicle) {
            setVehicle(JSON.parse(storedVehicle));
        }
    }, [dispatch, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const validateInputs = () => {
        const { cardNumber, expiryDate, cvv, nameOnCard, billingAddress } = formData;

        // Card number validation
        if (!/^\d{16}$/.test(cardNumber)) {
            return 'Invalid card number. It should be exactly 16 digits.';
        }

        // Expiry date validation
        const [month, year] = expiryDate.split('/');
        const monthInt = parseInt(month, 10);
        const yearInt = parseInt('20' + year, 10); // Convert YY to YYYY

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            return 'Invalid expiry date. Use MM/YY format.';
        }
        if (monthInt < 1 || monthInt > 12) {
            return 'Expiry month should be between 01 and 12.';
        }
        if (yearInt < currentYear || (yearInt === currentYear && monthInt < currentMonth)) {
            return 'Expiry date cannot be in the past.';
        }

        // CVV validation
        if (!/^\d{3}$/.test(cvv)) {
            return 'Invalid CVV. It should be exactly 3 digits.';
        }

        // Name on card validation
        const name = nameOnCard.trim();
        const nameRegex = /^[a-zA-Z\s]{2,50}$/;

        if (!name) {
           return "Name on card is required";
        } else if (!nameRegex.test(name)) {
           return "Name can only contain letters and spaces, and must be 2 to 50 characters long";
        }

        // Billing address validation
        if (!billingAddress || billingAddress.length < 5) {
            return 'Billing address must be at least 5 characters long.';
        }

        const addressRegex = /^[a-zA-Z0-9\s,.'-]{5,}$/;
        if (!addressRegex.test(billingAddress)) {
            return 'Billing address contains invalid characters.';
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateInputs();

        if (validationError) {
            setPaymentStatus(validationError);
            return;
        }

        if (formData.billingAddress && buyerDetails) {
            const rentData = {
                rentVehicleID: vehicle.rentVehicleID,
                buyer_username: buyerDetails.username,
                buyer_email: buyerDetails.email,
                billingAddress: formData.billingAddress,
                buyerDetails
            };

            try {
                const token = localStorage.getItem('token');
                await fetch('http://localhost:5000/addBuyerDetails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(rentData)
                });

                localStorage.removeItem('vehicleDetails');

                setPaymentStatus('Payment successful and details submitted!');
                navigate('/buyerRentedVehicles');
            } catch (error) {
                console.error('Error adding buyer details:', error);
                setPaymentStatus('Submission failed. Please try again.');
            }
        } else {
            setPaymentStatus('Please provide all required details.');
        }
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
            navigate("/buyerDashBoard");
        }, 301000);

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
                            <p style={{ textAlign: "center" }}>Payment session expired.</p>
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
    )
}
