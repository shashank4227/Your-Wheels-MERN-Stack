const Buyer = require("../models/BuyerModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Vehicle = require("../models/UsedVehicleMode"); // Assuming you have a Vehicle model
const { authenticateToken } = require("../middleware/authMiddleware");

const JWT_SECRET = "your_jwt_secret"; // Use a secure key and store it in env variables in production

// Helper function to generate JWT
const generateToken = (id, buyer_username, buyer_email) => {
  return jwt.sign({ id, buyer_username, buyer_email }, JWT_SECRET, {
    expiresIn: "1h", // Token valid for 1 hour
  });
};

// Register a new buyer
exports.buyerRegisterUser = async (req, res) => {
  const { buyer_username, buyer_email, buyer_password } = req.body;
  try {
    // Check if a user already exists based on email and username
    const existingUserByEmail = await Buyer.findOne({ buyer_email });
    const existingUserByUsername = await Buyer.findOne({ buyer_username });

    

    if (existingUserByUsername) {
      return res.status(400).json({ message: "Username is already in use" });
    }
    if (existingUserByEmail) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    // Create the user
    const user = await Buyer.create({
      buyer_username,
      buyer_email,
      buyer_password, // Password will be hashed in the schema's pre-save hook
    });

    // Generate JWT
    const token = generateToken(
      user._id,
      user.buyer_username,
      user.buyer_email
    );

    res.status(201).json({
      message: "User registered successfully",
      token, // Send JWT back to the client
      user: {
        username: user.buyer_username,
        email: user.buyer_email,
      },
    });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Server error" }); // Use 500 for server errors
  }
};

// Login a buyer
exports.buyerloginUser = async (req, res) => {
  const { buyer_username, buyer_password } = req.body;
  try {
    const user = await Buyer.findOne({ buyer_username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Match password
    const isMatch = await bcrypt.compare(buyer_password, user.buyer_password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = generateToken(
      user._id,
      user.buyer_username,
      user.buyer_email,
      "seller"
    );

    res.json({
      message: "Login successful",
      token, // Send JWT to the client
      user: {
        username: user.buyer_username,
        email: user.buyer_email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get buyer details - Protected route
exports.getBuyerDetails = async (req, res) => {
  try {
    const user = req.user; // Retrieved from the middleware after token verification
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const buyerDetails = await Buyer.findOne({ buyer_username: user.username });
    res.json({
      id: user._id,
      username: user.buyer_username,
      email: user.buyer_email,
      isMember: user.isMember,
      membershipType: user.membershipType, // Include membershipType
      membershipAmount: user.membershipAmount, // Include membershipAmount
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.getAllBuyers = async (req, res) => {
  try {
    const buyers = await Buyer.find(); // Fetch only username and email
    res.status(200).json(buyers);
  } catch (err) {
    console.error("Error fetching buyers data:", err);
    res
      .status(500)
      .json({ message: "Server error. Unable to fetch buyers data." });
  }
};

const Rent = require("../models/RentModel");

exports.countRentedVehiclesByBuyer = async (req, res) => {
  try {
    // Extract buyer_username from the token via req.user
    const { buyer_username } = req.user;

    // Count the number of rented vehicles associated with this buyer
    const rentedVehicleCount = await Rent.countDocuments({
      buyer_username,
      isRented: true,
    });

    // Send the count in the response
    res.status(200).json({ rentedVehicleCount });
  } catch (error) {
    console.error("Error fetching rented vehicles count:", error);
    res.status(500).json({ message: "Error fetching rented vehicles count" });
  }
};

exports.addBuyerMembership = async (req, res) => {
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
    const { buyer_username } = req.user;

    // Find the buyer by username
    const buyerDetails = await Buyer.findOne({
      buyer_username: buyer_username,
    });
    if (!buyerDetails) {
      return res.status(404).json({ message: "Buyer not found" });
    }

    // Update the buyer's isMember status to true upon successful payment
    buyerDetails.isMember = true;
    buyerDetails.membershipType = membershipType; // Update membershipType
    buyerDetails.membershipAmount = membershipAmount; // Update membershipAmount
    await buyerDetails.save();

    // Send success response
    res.status(200).json({
      message: "Membership payment successful and membership status updated",
      buyerDetails,
    });
  } catch (error) {
    console.error("Error in processing membership payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.SearchUsedVehicles = async (req, res) => {
  console.log("Searching used vehicles");

  try {
    const {
      carName,
      location,
      vehicleType,
      budget,
      vehicleCompany,
      registrationYear,
      fuelType,
    } = req.query; // Use req.query to get query parameters from the URL

    // Build the search query based on provided filters
    let query = {};

    if (carName) query.name = { $regex: carName, $options: "i" }; // Case-insensitive regex for partial matches
    if (location) query.location = location;
    if (vehicleType) query.vehicleType = vehicleType;
    if (budget) query.budget = { $lte: budget }; // Find vehicles with budget <= specified value
    if (vehicleCompany)
      query.company = { $regex: vehicleCompany, $options: "i" }; // Case-insensitive regex for company
    if (registrationYear) query.registrationYear = registrationYear;
    if (fuelType) query.fuelType = fuelType;

    // Fetch matching vehicles from the database
    const vehicles = await Vehicle.find(query);
    console.log(vehicles);

    // If no vehicles match the criteria, send a 404 response
    if (vehicles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No vehicles found matching the search criteria.",
      });
    }

    // Send the fetched vehicles in the response
    res.status(200).json({
      success: true,
      vehicles,
    });
  } catch (error) {
    console.error("Error fetching used vehicles:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while searching for vehicles.",
      error: error.message, // Provide additional error details for easier debugging
    });
  }
};

// Route to get all rented vehicles by buyer_username
exports.RentedVehiclesByBuyer = async (req, res) => {
  try {
    const buyerUsername = req.user.buyer_username; // Extract buyer_username from the token
    const rentedVehicles = await Rent.find({ buyer_username: buyerUsername });

    if (rentedVehicles.length === 0) {
      return res.json({ message: "No vehicles rented by this buyer" });
    }

    res.status(200).json(rentedVehicles);
  } catch (error) {
    console.error("Error fetching rented vehicles:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.searchRentDetails = async (req, res) => {
  try {
    // Extracting query parameters from the request
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
    } = req.query;

    // Build a query object based on the parameters provided
    let query = {};

    if (vehicleType) query.vehicleType = vehicleType;
    if (location) query.location = location;
    if (fuelType) query.fuelType = fuelType;
    if (registrationYear) query.registrationYear = registrationYear;
    if (vehicleCompany) query.vehicleCompany = new RegExp(vehicleCompany, "i"); // Case insensitive search
    if (vehicleModel) query.vehicleModel = new RegExp(vehicleModel, "i");
    if (rentPrice) query.rentPrice = { $lte: rentPrice }; // Rent price less than or equal to input
    if (availabilityStartDate)
      query.availabilityStartDate = { $gte: new Date(availabilityStartDate) };
    if (availabilityEndDate)
      query.availabilityEndDate = { $lte: new Date(availabilityEndDate) };
    query.isRented = false;
    // Query the database for the rented vehicles based on the filters
    const rentedVehicles = await Rent.find(query);

    // Check if any vehicles match the query
    if (rentedVehicles.length === 0) {
      return res
        .status(404)
        .json({ message: "No rented vehicles found matching the criteria." });
    }

    // Send back the results in the response
    res.status(200).json(rentedVehicles);
  } catch (error) {
    console.error("Error fetching rented vehicles:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
exports.addBuyerDetails = async (req, res) => {
  try {
    const {
      billingAddress,
      buyerDetails,
      buyer_username,
      buyer_email,
      rentVehicleID,
    } = req.body;

    // Check if required details are provided
    if (!billingAddress || !buyerDetails || !rentVehicleID) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Find the Rent record based on the rentVehicleID
    const rent = await Rent.findOne({ rentVehicleID: rentVehicleID });
    // If rent record is not found, return an error response
    if (!rent) {
      return res.status(404).json({ message: "Rent record not found." });
    }
    rent.isRented = true;

    // Update the Rent record with buyer details
    rent.buyer_username = buyer_username;
    rent.buyer_email = buyer_email;
    rent.billingAddress = billingAddress;

    // Save the updated rent details to the database
    await rent.save();

    res
      .status(200)
      .json({ message: "Buyer details and rent details added successfully." });
  } catch (error) {
    console.error("Error adding buyer details:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
exports.getRentedVehiclesCountByBuyer = async (req, res) => {
  const { buyer_username } = req.params; // Fetch buyer_username from URL parameters

  try {
    // Count vehicles rented by the buyer where isRented is true
    const rentedCount = await Rent.countDocuments({
      buyer_username: buyer_username,
      isRented: true,
    });

    res.status(200).json({ buyer_username, rentedCount });
  } catch (err) {
    console.error("Error fetching rented vehicle count:", err);
    res.status(500).json({ message: "Server error" });
  }
};
