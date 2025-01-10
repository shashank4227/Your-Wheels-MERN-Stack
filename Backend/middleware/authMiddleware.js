const jwt = require("jsonwebtoken");
const Buyer = require("../models/BuyerModel");
const Seller = require("../models/SellerModel");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Use environment variable for secret

// Middleware to protect buyer routes
exports.protectBuyer = async (req, res, next) => {
  let token;

  // Check for token in authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Get buyer from the token
      req.user = await Buyer.findById(decoded.id).select("-buyer_password");

      if (!req.user) {
        return res.status(404).json({ message: "Buyer not found" });
      }

      next(); // Proceed to the next middleware or controller
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "No token, authorization denied" });
  }
};

exports.protectSeller = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      // Ensure the user is found and includes necessary fields
      req.user = await Seller.findById(decoded.id).select(
        "seller_username seller_email"
      ); // Adjust fields as necessary

      if (!req.user) {
        return res.status(403).json({ message: "Seller not found" });
      }

      next();
    } catch (err) {
      console.error("Token verification error:", err);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "No token, authorization denied" });
  }
};

exports.verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await Seller.findById(decoded.id);

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    req.user = {
      id: user._id,
      username: user.seller_username,
      email: user.seller_email,
      role: decoded.role,
    };

    next(); // Proceed to next middleware or route handler
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(403).json({ message: "Invalid token" });
  }
};

const RentalCompany = require("../models/RentalCompany");

exports.verifyTokenByCompany = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await RentalCompany.findById(decoded.id);

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: decoded.role,
    };

    next(); // Proceed to next middleware or route handler
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(403).json({ message: "Invalid token" });
  }
};

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("No authorization header provided");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Token verification failed:", err.message);
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};
