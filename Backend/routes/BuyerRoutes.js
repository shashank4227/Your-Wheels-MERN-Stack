const express = require("express");
const router = express.Router();


const {
    buyerRegisterUser,
    buyerloginUser,
    getBuyerDetails,
    getAllBuyers,
    addBuyerMembership,
    SearchUsedVehicles,
    RentedVehiclesByBuyer,
    searchRentDetails,
    countRentedVehiclesByBuyer,
    addBuyerDetails,
    getRentedVehiclesCountByBuyer
} = require("../controllers/BuyerController");
  
const { protectBuyer } = require("../middleware/authMiddleware");

router.post("/buyerregister", buyerRegisterUser);
router.post("/buyerlogin", buyerloginUser);
router.get("/getBuyerDetails", protectBuyer, getBuyerDetails); // Protected route
router.post("/addBuyerMembership", protectBuyer, addBuyerMembership); // Protected route
router.get("/search-used-vehicles", SearchUsedVehicles);
router.get("/buyers-data", getAllBuyers); // Protected route
router.get("/rented-vehicles-by-buyer",protectBuyer, RentedVehiclesByBuyer);
router.get('/search-rent-details', searchRentDetails);
router.get("/count-rented-vehicles-by-buyer", protectBuyer, countRentedVehiclesByBuyer);
router.post("/addBuyerDetails", addBuyerDetails);
router.get(
    "/rented-vehicles-count/:buyer_username",
    getRentedVehiclesCountByBuyer
  );

module.exports = router;