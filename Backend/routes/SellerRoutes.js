const express = require("express");
const router = express.Router();

const {
  protectSeller,
  verifyToken,
} = require("../middleware/authMiddleware");

const {
  sellerRegisterUser,
  sellerLoginUser,
  getSellerDetails,
  getAllSellers,
  vehicleSaleCount,
  addSellerMembership,
  getVehiclesOnSaleBySeller,
  submitRentDetails,
  getVehiclesForSeller,
  getVehiclesBySeller,
  getVehiclesOnRent,
  submitSellDetails,
  SellersCountWithMembershipDetails,
  getBookedVehicles
} = require("../controllers/SellerController");

router.post("/sellerregister", sellerRegisterUser);
router.post("/sellerlogin", sellerLoginUser);
router.get("/sellers-data", getAllSellers);
router.get("/getSellerDetails", protectSeller, getSellerDetails); // Protected route
router.get("/vehicle-sale-count", verifyToken, vehicleSaleCount);
router.post("/addSellerMembership",protectSeller, addSellerMembership);
router.get(
  "/vehicles-on-sale-by-seller",
  protectSeller,
  getVehiclesOnSaleBySeller
);
router.post("/submit-rent-details", submitRentDetails);
router.get("/vehicles-by-seller", protectSeller, getVehiclesForSeller);
router.get("/vehicles-on-rent", getVehiclesOnRent);
router.get("/get-booked-vehicles",protectSeller, getBookedVehicles);


router.post("/submitSellDetails", submitSellDetails);
router.get("/vehicle-count", protectSeller, getVehiclesBySeller);
router.get("/sellers-count-with-membership-details",  SellersCountWithMembershipDetails);

module.exports = router;