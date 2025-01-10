const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Vehicle = require("../models/RentModel");
const Buyer = require("../models/BuyerModel");
const Seller = require("../models/SellerModel");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Ensure this is consistent across your app

// Hardcoded admins (for testing purposes)
const admins = [
  {
    username: process.env.ADMIN_1_USERNAME,
    email: process.env.ADMIN_1_EMAIL,
    password: bcrypt.hashSync(process.env.ADMIN_1_PASSWORD, 10), // Use password from .env
  },
  {
    username: process.env.ADMIN_2_USERNAME,
    email: process.env.ADMIN_2_EMAIL,
    password: bcrypt.hashSync(process.env.ADMIN_2_PASSWORD, 10), // Use password from .env
  },
  {
    username: process.env.ADMIN_3_USERNAME,
    email: process.env.ADMIN_3_EMAIL,
    password: bcrypt.hashSync(process.env.ADMIN_3_PASSWORD, 10), // Use password from .env
  },
  {
    username: process.env.ADMIN_4_USERNAME,
    email: process.env.ADMIN_4_EMAIL,
    password: bcrypt.hashSync(process.env.ADMIN_4_PASSWORD, 10), // Use password from .env
  },
  {
    username: process.env.ADMIN_5_USERNAME,
    email: process.env.ADMIN_5_EMAIL,
    password: bcrypt.hashSync(process.env.ADMIN_5_PASSWORD, 10), // Use password from .env
  },
];

exports.adminloginUser = (req, res) => {
  const { admin_username, admin_password } = req.body;

  // Find the admin in the hardcoded array
  const admin = admins.find((admin) => admin.username === admin_username);

  // If the admin doesn't exist, return an error
  if (!admin) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  // Check if the provided password matches the stored hashed password
  const isMatch = bcrypt.compareSync(admin_password, admin.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  // Generate a JWT token for the authenticated admin
  const token = jwt.sign(
    { username: admin.username, email: admin.email }, // Payload includes email
    JWT_SECRET,
    { expiresIn: "1h" } // Token expiry
  );

  // Respond with a success message, token, and admin details
  res.json({
    message: "Login successful",
    token, // Send JWT token to the client
    user: {
      username: admin.username, // Include username in the response
    },
  });
};

// Single endpoint for fetching admin details
exports.getAdminDetails = (req, res) => {
  try {
    // Assuming you've used middleware to verify the token and set req.user
    const admin = req.user; // Retrieve admin from middleware after token verification

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Send back admin details
    res.json({
      username: admin.username,
      email: admin.email || "Email not available", // Email should be available
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.adminlogoutUser = (req, res) => {
  // As JWT is stateless, no server-side session or token invalidation is needed.
  // Just send a response indicating logout success.
  res.json({ message: "Logout successful" });
};

exports.rentedVehicles = async (req, res) => {
  try {
    const rentedVehicles = await Vehicle.find();
    res.status(200).json(rentedVehicles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rented vehicles" });
  }
};

exports.rentedVehiclesByAdmin = async (req, res) => {
  try {
    const rentedVehicles = await Vehicle.find({ isRented: true });
    res.status(200).json(rentedVehicles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rented vehicles" });
  }
};

const UsedVehicle = require("../models/UsedVehicleMode");
exports.getVehicleOnSale = async (req, res) => {
  try {
    const vehicleOnSale = await UsedVehicle.find();
    res.json(vehicleOnSale);
  } catch (err) {
    console.log(err);
  }
};

exports.deleteBuyer = async (req, res) => {
  const buyerId = req.params.id;

  try {
    const deletedBuyer = await Buyer.findByIdAndDelete(buyerId);

    if (!deletedBuyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }

    res.status(200).json({ message: "Buyer deleted successfully" });
  } catch (error) {
    console.error("Error deleting buyer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.SellerData = async (req, res) => {
  try {
    const sellers = await Seller.find();
    res.status(200).json(sellers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching sellers" });
  }
};

exports.SellerDataDeleteWithID = async (req, res) => {
  const sellerId = req.params.id;
  try {
    const deletedSeller = await Seller.findByIdAndDelete(sellerId);
    if (!deletedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    res.status(200).json({ message: "Seller deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting seller" });
  }
};

exports.GetSellerDataWithID = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    res.status(200).json(seller);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching seller details", error: err.message });
  }
};

exports.UpdateSellerWithID = async (req, res) => {
  const sellerId = req.params.id;
  const { seller_username, seller_email, isMember } = req.body;

  try {
    const updatedSeller = await Seller.findByIdAndUpdate(
      sellerId,
      { seller_username, seller_email, isMember },
      { new: true, runValidators: true } // Ensure validators run during update
    );

    if (!updatedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json(updatedSeller);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating seller", error: err.message });
  }
};

exports.UpdateBuyerWithID = async (req, res) => {
  const { id } = req.params;
  const { buyer_username, buyer_email, isMember } = req.body;
  console.log(req.params + req.body);
  try {
    // Find and update the buyer
    const updatedBuyer = await Buyer.findByIdAndUpdate(
      id,
      { buyer_username, buyer_email, isMember },
      { new: true, runValidators: true } // Returns the updated document
    );

    if (!updatedBuyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }

    res
      .status(200)
      .json({ message: "Buyer updated successfully", updatedBuyer });
  } catch (error) {
    console.error("Error updating buyer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.GetBuyerDataWithID = async (req, res) => {
  const { id } = req.params;

  try {
    const buyer = await Buyer.findById(id);

    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }

    res.status(200).json(buyer);
  } catch (error) {
    console.error("Error fetching buyer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller to get buyer count and membership details
exports.BuyersCountWithMembershipDetails = async (req, res) => {
  try {
    // Count the total number of buyers
    const buyersCount = await Buyer.countDocuments();

    // Count the number of buyers who are members (isMember is true)
    const membershipBuyers = await Buyer.countDocuments({ isMember: true });
    const totalMembershipAmount = await Buyer.aggregate([
      {
        $group: {
          _id: null, // Grouping all documents
          totalAmount: { $sum: "$membershipAmount" }, // Summing up membershipAmount
        },
      },
    ]);

    // Ensure totalAmount is returned as a number
    const totalAmount =
      totalMembershipAmount.length > 0
        ? totalMembershipAmount[0].totalAmount
        : 0;

    res.status(200).json({
      buyersCount,
      membershipBuyers,
      totalAmount,
    });
  } catch (error) {
    console.error("Error fetching buyers count:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Sample methods for fetching vehicle counts or other statistics could be added here
