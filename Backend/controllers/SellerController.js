const Seller = require("../models/SellerModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Vehicle = require("../models/UsedVehicleMode");
const Rent = require("../models/RentModel");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Use environment variable for secret
const { v4: uuidv4 } = require("uuid");
// Helper function to generate JWT
const generateToken = (id, username, role) => {
  return jwt.sign({ id, username, role }, JWT_SECRET, {
    expiresIn: "1h", // Token valid for 1 hour
  });
};

// Register a new seller
exports.sellerRegisterUser = async (req, res) => {
  const { seller_username, seller_email, seller_password } = req.body;

  try {
    // Check if seller already exists based on email and username
    const existingUserByEmail = await Seller.findOne({ seller_email });
    const existingUserByUsername = await Seller.findOne({ seller_username });

    if (existingUserByEmail) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    if (existingUserByUsername) {
      return res.status(400).json({ message: "Username is already in use" });
    }

    // Create the seller
    const user = await Seller.create({
      seller_username,
      seller_email,
      seller_password, // Password will be hashed in the schema's pre-save hook
    });

    // Generate JWT
    const token = generateToken(user._id, user.seller_username, "seller");

    res.status(201).json({
      message: "Seller registered successfully",
      token, // Send JWT back to the client
      user: {
        username: user.seller_username,
        email: user.seller_email,
      },
    });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Server error" }); // Use 500 for server errors
  }
};

// Login a seller

exports.sellerLoginUser = async (req, res) => {
  const { seller_username, seller_password } = req.body;

  try {
    // Find user by username
    const user = await Seller.findOne({ seller_username });
    if (!user) {
      // console.log("User not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare provided password with hashed password in the database
    const isMatch = await bcrypt.compare(seller_password, user.seller_password);

    if (!isMatch) {
      // console.log("Password mismatch");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = generateToken(
      user._id,
      user.seller_username,
      user.seller_email,
      "seller"
    );
    // Respond with token and user details
    res.status(200).json({
      message: "Login successful",
      token, // Send JWT to the client
      user: {
        username: user.seller_username,
        email: user.seller_email,
      },
    });
  } catch (err) {
    console.error("Error during login:", err); // Include `err` for better debugging
    res.status(500).json({ message: "Server error" });
  }
};
exports.getSellerDetails = async (req, res) => {
  try {
    const user = req.user; // Retrieved from the middleware after token verification
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user);
    // Fetch seller details from the database
    const sellerDetails = await Seller.findOne({
      seller_username: user.seller_username,
    });
    console.log(sellerDetails);

    if (!sellerDetails) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.json({
      id: sellerDetails._id,
      username: sellerDetails.seller_username, // Changed from buyer_username to seller_username
      email: sellerDetails.seller_email, // Changed from buyer_email to seller_email
      isMember: sellerDetails.isMember,
      membershipType: sellerDetails.membershipType, // Include membershipType
      membershipAmount: sellerDetails.membershipAmount, // Include membershipAmount
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Logout Seller
exports.sellerLogoutUser = (req, res) => {
  // For JWT, you don't need to clear session, just inform the client to remove the token
  res.json({ message: "Logout successful" });
};
exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find(); // Fetch sellers and only include username and email fields
    res.status(200).json(sellers);
  } catch (err) {
    console.error("Error fetching sellers:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.vehicleSaleCount = async (req, res) => {
  try {
    const { username } = req.user; // Destructure username from req.user
    const vehicleSaleCount = await Vehicle.countDocuments({
      seller_username: username,
    });
    if (vehicleSaleCount === null) {
      return res.status(404).json({ message: "No vehicles found for sale" });
    }

    res.status(200).json({ vehicleSaleCount });
  } catch (err) {
    console.error(
      `Error fetching vehicle sale count for seller ${req.user.username}:`,
      err.message
    );
    res.status(500).json({
      message: "Internal server error while fetching vehicle sale count",
    });
  }
};

exports.addSellerMembership = async (req, res) => {
  try {
    const {
      cardNumber,
      expiryDate,
      cvv,
      nameOnCard,
      billingAddress,
      membershipType,
      membershipAmount,
    } = req.body;

    // Example validation of payment details
    if (
      !cardNumber ||
      cardNumber.length !== 16 ||
      !expiryDate ||
      !cvv ||
      !nameOnCard ||
      !billingAddress ||
      !membershipType || // Validate that membershipType is provided
      !membershipAmount // Validate that membershipAmount is provided
    ) {
      return res.status(400).json({ message: "Invalid payment details" });
    }

    // Simulate payment processing (In real-world, integrate with a payment gateway)
    const paymentSuccess = true; // This should be the result of the actual payment process
    if (!paymentSuccess) {
      return res.status(500).json({ message: "Payment processing failed" });
    }
    const { seller_username } = req.user; // Assuming req.user has seller information

    // Find the seller by username
    const sellerDetails = await Seller.findOne({
      seller_username: seller_username,
    });
    if (!sellerDetails) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // Update the seller's isMember status to true upon successful payment
    sellerDetails.isMember = true;
    sellerDetails.membershipType = membershipType; // Update membershipType
    sellerDetails.membershipAmount = membershipAmount; // Update membershipAmount
    console.log(sellerDetails);
    await sellerDetails.save();

    // Send success response
    res.status(200).json({
      message: "Membership payment successful and membership status updated",
      sellerDetails,
    });
  } catch (error) {
    console.error("Error in processing membership payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getVehiclesOnSaleBySeller = async (req, res) => {
  try {
    // Assuming req.user contains seller details set by protectSeller middleware
    const sellerUsername = req.user.seller_username;
    // Query the database for vehicles listed by this seller
    const vehiclesOnSale = await Vehicle.find({
      seller_username: sellerUsername,
    });
    console.log(vehiclesOnSale);
    if (!vehiclesOnSale || vehiclesOnSale.length === 0) {
      return res
        .status(404)
        .json({ message: "No vehicles found for this seller." });
    }

    // Return the list of vehicles
    res.status(200).json({ vehicles: vehiclesOnSale });
  } catch (error) {
    console.error("Error fetching vehicles for seller:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

exports.submitRentDetails = async (req, res) => {
  try {
    const {
      vehicleType,
      location,
      fuelType,
      registrationYear,
      vehicleCompany,
      vehicleModel,
      rentPrice,
      availabilityStartDate,
      availabilityEndDate,
      contactNumber,
      username,
    } = req.body;
    const sellerDetails = await Seller.findOne({ seller_username: username });
    const seller_email = sellerDetails.seller_email;
    const seller_username = username;
    if (!seller_username) {
      return res.status(400).json({ message: "Username is required" });
    }
    const isRented = false;
    const rentVehicleID = uuidv4();
    const rentDetail = new Rent({
      rentVehicleID,
      vehicleType,
      location,
      fuelType,
      registrationYear,
      vehicleCompany,
      vehicleModel,
      rentPrice,
      availabilityStartDate,
      availabilityEndDate,
      contactNumber,
      seller_username, // Add username to the record
      seller_email,
      isRented,
    });

    await rentDetail.save();

    res.status(201).json({ message: "Rent details submitted successfully!" });
  } catch (error) {
    console.error("Error submitting rent details:", error);
    res
      .status(500)
      .json({ message: "Error submitting rent details", error: error.message });
  }
};

exports.getVehiclesForSeller = async (req, res) => {
  try {
    const { seller_username } = req.user;
    if (!seller_username) {
      return res.status(403).json({ message: "Username is required" });
    }
    // Count the number of vehicles added by the seller
    const vehicles = await Rent.find({ seller_username: seller_username,isRented:false });

    res.json(vehicles);
  } catch (error) {
    console.error("Error retrieving vehicle count:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.getVehiclesBySeller = async (req, res) => {
  try {
    const { seller_username } = req.user; // Get username from token middleware

    if (!seller_username) {
      return res.status(403).json({ message: "Username is required" });
    }
    // Find vehicles where the username matches the logged-in seller
    const vehicles = await Rent.find({ seller_username: seller_username ,is});

    res.json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles for seller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.getVehiclesOnRent = async (req, res) => {
  try {
    const vehicles = await Rent.find({ isRented: false }); // Assuming 'isRented' field indicates availability
    res.json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles on rent:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.submitSellDetails = async (req, res) => {
  console.log("submitting sell details");
  const {
    vehicleType,
    location,
    fuelType,
    registrationYear,
    vehicleCompany,
    vehicleModel,
    sellingPrice,
    contactNumber,
    vehicleName,
    mileage,
    year,
    username,
  } = req.body;
  console.log(req.body);

  try {
    const sellerDetails = await Seller.findOne({ seller_username: username });
    const seller_email = sellerDetails.seller_email;
    const seller_username = username; // Check if all required fields are provided
    if (
      !vehicleCompany ||
      !vehicleModel ||
      !sellingPrice ||
      !registrationYear
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    // Save the used vehicle details
    const usedVehicle = new Vehicle({
      seller_username,
      seller_email,
      vehicleType,
      location,
      fuelType,
      registrationYear,
      vehicleCompany,
      vehicleName,
      vehicleModel,
      sellingPrice,
      contactNumber,
      sellingPrice,
      mileage,
      year,
    });
    console.log(usedVehicle);
    await usedVehicle.save();

    // Respond with success
    res.status(200).json({
      message:
        "Vehicle details and payment information submitted successfully.",
    });
  } catch (error) {
    console.error("Error in submit-sell-details:", error);
    res
      .status(500)
      .json({ message: "Failed to submit the details. Please try again." });
  }
};
// Controller to get buyer count and membership details
exports.SellersCountWithMembershipDetails = async (req, res) => {
  try {
    // Count the total number of buyers
    const sellerCount = await Seller.countDocuments();

    // Count the number of buyers who are members (isMember is true)
    const membershipSeller = await Seller.countDocuments({ isMember: true });
    const totalMembershipAmount = await Seller.aggregate([
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
    // Respond with both the total buyer count and membership buyer count
    res.status(200).json({
      sellerCount, // Total number of buyers
      membershipSeller, // Number of buyers with membership
      totalAmount,
    });
  } catch (error) {
    // Log the error and respond with a 500 status for server errors
    console.error("Error fetching buyer count and membership details:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getBookedVehicles = async (req, res) => {
  const sellerUsername = req.user.seller_username;
  try {
    const response = await Rent.find({ isRented: true, seller_username: sellerUsername });
    console.log(response);
    res.status(200).json(response)
  } catch (err) {
    console.log("Error:", err);
  }
}
