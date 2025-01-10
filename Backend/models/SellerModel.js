const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the schema
const userSchema = new mongoose.Schema({
  seller_username: {
    type: String,
    required: true,
    unique: true,
  },
  seller_email: {
    type: String,
    required: true,
    unique: true,
  },
  seller_password: {
    type: String,
    required: true,
  },
  isMember: {
    type: Boolean,
    default: false,
  },
  membershipType: { type: String }, // To store the type of membership
    membershipAmount: { type: Number}, // To store the membership amount
    billingAddress: { type: String },
});

// Hash the password before saving the document
userSchema.pre("save", async function (next) {
  if (!this.isModified("seller_password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.seller_password = await bcrypt.hash(this.seller_password, salt);
    next();
  } catch (error) {
    next(error); // Properly handle the error
  }
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.seller_password);
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};

// Avoid redefining the model
const Seller = mongoose.models.Seller || mongoose.model("Seller", userSchema);

module.exports = Seller;
