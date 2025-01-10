const bcrypt = require("bcryptjs");
const RentalCompany = require("../models/RentalCompany.js");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const Rent = require("../models/RentModel.js");
// Create a new rental company
// Create a new rental company
const nodemailer = require("nodemailer");

// Create a transporter object using your SMTP transport details
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",  
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "yourwheels123@gmail.com", // your email
    pass: "fjbd wpjz xhqa ezoa", // your app-specific password
  },
});



exports.CreateRentalCompany = async (req, res) => {
  const {
    rental_company_username,
    rental_company_email,
    rental_company_password,
  } = req.body;

  if (
    !rental_company_username ||
    !rental_company_email ||
    !rental_company_password
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUserByUsername = await RentalCompany.findOne({
      username: rental_company_username,
    });

    if (existingUserByUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const existingUserByEmail = await RentalCompany.findOne({
      email: rental_company_email,
    });

    if (existingUserByEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

   const hashedPassword = await bcrypt.hash(rental_company_password, 10);

    const newRentalCompany = new RentalCompany({
      username: rental_company_username,
      email: rental_company_email,
      password: hashedPassword,
    });

    await newRentalCompany.save();

    // Send confirmation email to the rental company with password
    const mailOptions = {
      from: "yourwheels123@gmail.com", // your email
      to: rental_company_email, // rental company's email
      subject: "Rental Company Account Created",
      html: `
        <h1>Welcome to YourWheels!</h1>
        <p>Dear ${rental_company_username},</p>
        <p>Your rental company account has been successfully created.</p>
        <p>Here are your account details:</p>
        <ul>
          <li>Username: ${rental_company_username}</li>
          <li>Email: ${rental_company_email}</li>
          <li>Password: ${rental_company_password}</li> <!-- Include the password -->
        </ul>
        <p>We recommend storing your password securely and not sharing it with anyone.</p>
        <p>Thank you for joining us!</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    return res
      .status(201)
      .json({ message: "Rental company user created successfully!" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error. Could not create rental company user." });
  }
};



// Rental company login
exports.RentalCompanyLogin = async (req, res) => {
  const { rental_company_username, rental_company_password } = req.body;

  if (!rental_company_username || !rental_company_password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const rentalCompany = await RentalCompany.findOne({
      username: rental_company_username,
    });

    if (!rentalCompany) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(
      rental_company_password,
      rentalCompany.password
    );

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: rentalCompany._id,
        rental_company_username: rentalCompany.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ token, message: "Login successful!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error. Could not log in." });
  }
};

// Get rental company details
// RentalCompanyController.js

exports.RentalCompanyDetails = async (req, res) => {
  try {
    // Assuming user data is added to req.user from token middleware
    const rentalCompanyId = req.user.id;

    // Find rental company by ID from token
    const company = await RentalCompany.findById(rentalCompanyId);

    if (!company) {
      return res.status(404).json({ message: "Rental company not found" });
    }

   console.log(company.username);

    // Await the vehicle rent count query to resolve
    const vehicleRentCount = await Rent.countDocuments({
      rental_company_username: company.username,
    });
    console.log(vehicleRentCount);

    // Return rental company details including vehicleRentCount
    res.status(200).json({
      id: company._id,
      username: company.username,
      email: company.email,
      isMember: company.isMember,
      vehicleRentCount: vehicleRentCount, // Include the vehicleRentCount
      // Include other fields if needed
    });
  } catch (error) {
    console.error("Error fetching rental company details:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Add rent details by rental company
exports.AddRentByCompany = async (req, res) => {
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

    const rental_company_details = await RentalCompany.findOne({
      username: username,
    });
    const rentVehicleID = uuidv4();
    const newRent = new Rent({
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
      rental_company_username: username,
      rental_company_email: rental_company_details.email,
    });

    await newRent.save();
    return res
      .status(201)
      .json({ message: "Vehicle added successfully!", rent: newRent });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error adding vehicle.", error: error.message });
  }
};

// Get vehicles by rental company
exports.VehiclesByCompany = async (req, res) => {
  try {
    const { username } = req.user;
    const vehicles = await Rent.find({ rental_company_username: username ,isRented:false});

    if (vehicles.length === 0) {
      return res
        .status(404)
        .json({ message: "No vehicles found for this rental company." });
    }

    return res.status(200).json(vehicles);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

// Retrieve all rental companies
exports.RentalCompanyData = async (req, res) => {
  try {
    const companies = await RentalCompany.find({});
    return res.status(200).json(companies);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching rental companies" });
  }
};

// Retrieve a rental company by ID
exports.RentalCompanyGetByID = async (req, res) => {
  try {
    const company = await RentalCompany.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Rental company not found" });
    }
    return res.status(200).json(company);
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching rental company details",
      error: err.message,
    });
  }
};

// Update rental company by ID
exports.UpdateRentalCompanyByID = async (req, res) => {
  const { id } = req.params;
  const { username, email, isMember } = req.body;

  try {
    const updatedCompany = await RentalCompany.findByIdAndUpdate(
      id,
      { username, email, isMember },
      { new: true, runValidators: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({ message: "Rental company not found" });
    }

    return res.status(200).json(updatedCompany);
  } catch (error) {
    console.error("Error updating rental company:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// Delete rental company by ID
exports.DeleteRentalCompanyDataWithID = async (req, res) => {
  try {
    const deletedCompany = await RentalCompany.findByIdAndDelete(req.params.id);
    if (!deletedCompany) {
      return res.status(404).json({ message: "Rental company not found" });
    }
    return res
      .status(200)
      .json({ message: "Rental company deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error deleting rental company", error: err.message });
  }
};

// Get rented vehicle count by company ID
exports.RentedVehicleCountByCompanyUsersWithCompanyID = async (req, res) => {
  const companyId = req.params.companyId;

  try {
    const count = await Rent.countDocuments({
      rental_company_username: companyId,
    });
    return res.status(200).json({ companyId, rentedCount: count });
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching rented vehicle count",
      error: err.message,
    });
  }
};

// Rental company payment processing
exports.rentalCompanyPayment = async (req, res) => {
  const { username } = req.body;

  try {
    const rentalCompany = await RentalCompany.findOne({ username });
    if (!rentalCompany) {
      return res.status(404).json({ message: "Rental company not found" });
    }
    rentalCompany.membershipAmount = 1000;
    rentalCompany.isMember = true;
    await rentalCompany.save();

    return res
      .status(200)
      .json({ message: "Payment processed and membership activated" });
  } catch (error) {
    console.error("Error processing payment:", error);
    return res.status(500).json({ message: "Error processing payment" });
  }
};

exports.RentalCompanyDataByAdminWithID = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the rental company by its ID
    const company = await RentalCompany.findById(id);

    if (!company) {
      return res.status(404).json({ message: "Rental company not found" });
    }

    // If found, send back the rental company data
    res.status(200).json(company);
  } catch (error) {
    console.error("Error fetching rental company:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
exports.RentalCompanyCountWithMembershipDetails = async (req, res) => {
  try {
    // Count the total number of buyers
    const rentalCompanyCount = await RentalCompany.countDocuments();

    // Count the number of buyers who are members (isMember is true)
    const membershipRentalCompany = await RentalCompany.countDocuments({
      isMember: true,
    });

    const totalMembershipAmount = await RentalCompany.aggregate([
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
      rentalCompanyCount, // Total number of buyers
      membershipRentalCompany, // Number of buyers with membership
      totalAmount,
    });
  } catch (error) {
    // Log the error and respond with a 500 status for server errors
    console.error("Error fetching buyer count and membership details:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
exports.GetBookedVehiclesOfCompany = async (req, res) => {
  try {
    const { username } = req.user;
    const vehicles = await Rent.find({ rental_company_username: username, isRented: true });

    if (vehicles.length === 0) {
      return res
        .status(404)
        .json({ message: "No vehicles found for this rental company." });
    }

    return res.status(200).json(vehicles);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};