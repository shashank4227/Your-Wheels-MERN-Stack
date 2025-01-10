import '../CSS/Home.css';
import React, { useState, useEffect } from 'react';
export default function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const features = [
        {
            name: "Recommending Vehicles",
            description: "This feature recommends vehicles (both cars and bikes) to users based on their specified preferences such as budget, preferred brand, fuel type, body type (e.g., sedan, SUV), and transmission type (automatic or manual). The system uses these inputs to filter through available options and suggest vehicles that best fit the user’s needs."
            ,image:"/features-1.png",
        },
        {
            name: "Renting Vehicles",
            description: "Users can rent vehicles based on their location. The system allows users to filter available rental vehicles by factors such as location, make, model, fuel type, year, and rent range. Users can specify their pickup and dropoff locations as well as the rental duration, and the system will present options accordingly."
            ,image:"/features-2.png",
        },{
            name: "Buying Used Vehicles",
            description: " This feature helps users find and purchase used vehicles. Filters like price, make, model, year, and location help narrow down the search. The system provides different purchase options, including certified vehicles (from dealers) and private sales (from individual owners)."
            ,image:"/features-3.png",
        },{
            name: "Selling Used Vehicles",
            description: "Users who want to sell their vehicles can use this feature to list their cars or bikes. They provide details such as make, model, year of manufacture, condition, and asking price. The system also collects verification documents like identity proof and ownership documentation to ensure the legitimacy of the sale."
            ,image:"/features-4.png",
        },
    ];

    const totalSlides = features.length;

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

    // const nextSlide = () => {
    //     setCurrentSlide((prev) => (prev + 1) % totalSlides);
    // };

    // const prevSlide = () => {
    //     setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    // };

    return (
        <div className='hero'>
            <div className="feature-slider">
            <br /><br />
            <div className="slide-wrapper">
                <div className='features-container'>
                    <div className='features'>
                        <h3>Our Features</h3>
                        <h1 className="slide-title">{features[currentSlide].name}</h1>
                        <p className="slide-description">{features[currentSlide].description}</p>
                    </div>
                    <div>
                        <div className='circle-div'>
                            <img src={features[currentSlide].image} alt="Car Image" className='feature-image' />
                        </div>
                    </div>
                    
                </div>
               
                {/* <div className="navigation-arrow left" onClick={prevSlide}>&#10094;</div>
                <div className="navigation-arrow right" onClick={nextSlide}>&#10095;</div> */}
            </div>
            <div className="indicator-dots">
                {features.map((_, index) => (
                    <span
                        key={index}
                        className={`indicator-dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    ></span>
                ))}
            </div>
            </div>
        </div>
    );
}
