import React, { useState, useEffect } from 'react';
import '../CSS/LatestBikes.css'; // Optional for custom styling

const LatestBikes = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const bikes = [
        {
            makeModel: "Yamaha YZF R15 V4",
            image: "/home-bike-1.png",
            price:" ₹1,85,000",
            alt: "Bike 1"
        },
        {
            makeModel: "Royal Enfield Classic 350",
            image: "/home-bike-2.png",
            price:"₹2,00,000",
            alt: "Bike 2"
        },
        {
            makeModel: "Bajaj Pulsar NS200",
            image: "/home-bike-3.png",
            price:"₹1,40,000",
            alt: "Bike 3"
        },
    ];

    const totalSlides = bikes.length;

    // Automatic slide transition after 5 seconds
    useEffect(() => {
        const autoSlide = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
        }, 3000);

        return () => clearInterval(autoSlide); // Cleanup the interval on component unmount
    }, [totalSlides]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    return (
        <div className="car-slider">
            <br /><br />
            <h3>Latest Bikes</h3>
            <div className="slider-container">
                <img src={bikes[currentSlide].image} alt={bikes[currentSlide].alt} className="car-image" />
                <div className="arrow left-arrow" onClick={prevSlide}>&#10094;</div>
                <div className="arrow right-arrow" onClick={nextSlide}>&#10095;</div>
            </div>
            <h1>{bikes[currentSlide].makeModel}</h1>
            <p>{bikes[currentSlide].price}</p>
            <div className="dots-container">
                {bikes.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default LatestBikes;
