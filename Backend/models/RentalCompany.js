const mongoose = require("mongoose");

const rentalCompanySchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  isMember: {
    type: Boolean,
    default: false,
  },
  membershipAmount: {
    type: Number,
    default: 0,
  },
});

const RentalCompany = mongoose.model("RentalCompany", rentalCompanySchema);

module.exports = RentalCompany;
