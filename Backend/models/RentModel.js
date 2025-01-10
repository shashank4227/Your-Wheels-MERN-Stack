const mongoose = require("mongoose");

const rentDetailSchema = new mongoose.Schema({
  rentVehicleID: { type: String },
  vehicleType: { type: String, required: true },
  location: { type: String, required: true },
  fuelType: { type: String, required: true },
  registrationYear: { type: String, required: true },
  vehicleCompany: { type: String, required: true },
  vehicleModel: { type: String, required: true },
  rentPrice: { type: Number, required: true },
  availabilityStartDate: { type: Date, required: true },
  availabilityEndDate: { type: Date, required: true },
  contactNumber: { type: String, required: true },
  seller_username: { type: String,  }, // Ensure this is present and correctly defined
  seller_email: { type: String,  },
  isRented: { type: Boolean,default:false },
  buyer_username: { type: String },
  buyer_email: { type: String },
  rental_company_username: { type: String },
  rental_company_email: { type: String },
});

module.exports = mongoose.model("RentDetail", rentDetailSchema);
