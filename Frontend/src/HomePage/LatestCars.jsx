import React, { useState, useEffect } from 'react';
import '../CSS/LatestCars.css'; // Optional for custom styling

const LatestCars = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const cars = [
        {
            makeModel: "Maruti Suzuki Swift",
            image: "/home-car-1.png",
            price:"₹5.99 Lakh",
            alt: "Car 1"
        },
        {
            makeModel: "Tata Nexon",
            image: "/home-car-2.png",
            price:"₹8.10 Lakh",
            alt: "Car 2"
        },
        {
            makeModel: "Hyundai Creta",
            image: "/home-car-3.png",
            price:"₹10.87 Lakh",
            alt: "Car 3"
        },
    ];

    const totalSlides = cars.length;

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
            <h3>Latest Cars</h3>
            <div className="slider-container">
                <img src={cars[currentSlide].image} alt={cars[currentSlide].alt} className="car-image" />
                <div className="arrow left-arrow" onClick={prevSlide}>&#10094;</div>
                <div className="arrow right-arrow" onClick={nextSlide}>&#10095;</div>
            </div>
            <h1>{cars[currentSlide].makeModel}</h1>
            <p>{cars[currentSlide].price}</p>
            <div className="dots-container">
                {cars.map((_, index) => (
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

export default LatestCars;
