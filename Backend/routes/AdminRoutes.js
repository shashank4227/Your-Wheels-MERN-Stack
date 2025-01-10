const express = require("express");
const router = express.Router();

// Middleware import
const authenticateJWT = require("../middleware/auth");

const {
  adminloginUser,
  adminlogoutUser,
  getAdminDetails,
  rentedVehicles,
  rentedVehiclesByAdmin,
  getVehicleOnSale,
  deleteBuyer,
  SellerData,
  SellerDataDeleteWithID,
  GetSellerDataWithID,
  UpdateSellerWithID,
  UpdateBuyerWithID,
  GetBuyerDataWithID,
  BuyersCountWithMembershipDetails,
} = require("../controllers/AdminController");

// Admin routes
router.post("/adminlogin", adminloginUser);
router.post("/adminlogout", adminlogoutUser);
router.get("/getAdminDetails", authenticateJWT, getAdminDetails);
router.get("/rented-vehicles", rentedVehicles);
router.get("/rented-vehicles-by-admin", rentedVehiclesByAdmin);
router.get("/admin-vehicle-on-sale", getVehicleOnSale);
router.delete("/buyers-data/:id", deleteBuyer);
router.get("/sellers-data", SellerData);
router.delete("/sellers-data/:id", SellerDataDeleteWithID);
router.get("/sellers-data/:id", GetSellerDataWithID);
router.put("/update-seller/:id", UpdateSellerWithID);

router.put("/update-buyer/:id", UpdateBuyerWithID);
router.get("/buyers-data/:id", GetBuyerDataWithID);
router.get(
  "/buyers-count-with-membership-details",
  BuyersCountWithMembershipDetails
);

module.exports = router;
