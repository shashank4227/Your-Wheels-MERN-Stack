const Car = require("../models/VehicleModel"); // Adjust the path as necessary

// Controller function to handle search results
exports.getSearchResults = async (req, res) => {
  console.log("searching results");
  try {
    // Extract search parameters from the request query
    const { query, location, type, budget, brand, year, fuelType } = req.query;

    // Construct a MongoDB query based on the search parameters
    const searchQuery = {};

    if (query) searchQuery.vehicleName = { $regex: new RegExp(query, "i") }; // Case-insensitive search
    if (location) searchQuery.location = location;
    if (type) searchQuery.type = type;
    if (budget) searchQuery.budget = budget; // Ensure budget is handled as a string or parse as necessary
    if (brand) searchQuery.brand = brand;
    if (year) searchQuery.year = year === "0" ? { $exists: true } : year; // Handle 'All Years'
    if (fuelType && fuelType !== "all") searchQuery.fuelType = fuelType;

    // Perform the search in the MongoDB collection
    const cars = await Car.find(searchQuery);

    // Send the search results as JSON
    res.json(cars);
  } catch (err) {
    // Handle errors
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
};
