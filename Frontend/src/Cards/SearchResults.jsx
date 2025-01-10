import React from 'react';
import '../CSS/Search.css'; // Import your CSS file

const SearchResults = ({ cars }) => {
  // Check if `cars` is defined and is an array
  if (!Array.isArray(cars)) {
    return <div>No results found</div>;
  }

  return (
    <div className="search-results-container">
      {cars.length === 0 ? (
        <p>No results found</p>
      ) : (
        cars.map((car, index) => (
          <div key={index} className="car-card">
            <img src={`car-${index + 1}.jpg`} alt={car.vehicleName} className="car-image" />
            <div className="car-details">
              <h3 className="car-model">{car.vehicleName}</h3>
              <p className="car-brand">Brand: {car.brand}</p>
              <p className="car-price">Price: {car.budget}</p>
              <p className="car-location">Location: {car.location}</p>
              <p className="car-year">Year: {car.year}</p>
              <p className="car-fuel">Fuel Type: {car.fuelType}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SearchResults;
