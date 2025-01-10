const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  vehicleName: {
    type: String,
  },
  location: {
    type: String,
    enum: ["hyderabad", "chennai", "bangalore", "mumbai", "delhi"],
  },
  type: {
    type: String,
    enum: ["car", "bike"],
  },
  budget: {
    type: String,
    enum: [
      "below 5,00,000",
      "5,00,000 - 7,50,000",
      "20,00,000 - 30,00,000",
      "above 30,00,000",
    ],
  },
  brand: {
    type: String,
    enum: [
      "tata",
      "toyota",
      "honda",
      "ford",
      "chevrolet",
      "bmw",
      "audi",
      "mercedes",
      "volkswagen",
      "hyundai",
      "yamaha",
      "ktm",
      "royal-enfield",
      "bajaj",
      "tvs",
    ],
  },
  year: {
    type: String,
    enum: ["0", "2024", "2023", "2022", "2021", "2020", "before2020"],
  },
  fuelType: {
    type: String,
    enum: ["all", "petrol", "diesel", "electric", "hybrid"],
  },
  image: {
    type: String,
  },
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
