const express = require("express");
const session = require("express-session");
const SellerRoutes = require("./routes/SellerRoutes");
const BuyerRoutes = require("./routes/BuyerRoutes");
const AdminRoutes = require("./routes/AdminRoutes");
const SearchRoutes = require("./routes/SearchRoutes");
const RentalCompanyRoutes = require("./routes/RentalCompanyRoutes");
const connectDB = require("./config/db"); // Correctly import connectDB
require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true, // Allow cookies to be sent
  })
);

// Connect to database
connectDB();

app.use(express.json()); // For parsing application/json

// Routes
app.use("/", SellerRoutes);
app.use("/", BuyerRoutes);
app.use("/", SearchRoutes);
app.use("/", AdminRoutes);
app.use("/", RentalCompanyRoutes);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
