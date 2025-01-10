const express = require("express");
const router = express.Router();

// // Controller imports
// const RentalCompany = require("../controllers/RentalCompany");
// // const RentalCompanyPayment = require("../controllers/CompanyPayment");
// const { verifyTokenByCompany } = require("../middleware/authMiddleware");

// // Rental company routes
// router.post("/create-rental-company", RentalCompany);
// router.post("/rentalcompanylogin", RentalCompany);
// router.get("/rentalcompanydetails", RentalCompany);

// // Rental company data routes
// router.get("/rental-company-data", RentalCompany);
// router.get("/rental-company-data/:id", RentalCompany);
// router.post("/rental-company-data", RentalCompany);
// router.put("/rental-company-data/:id", RentalCompany);
// router.delete("/rental-company-data/:id", RentalCompany);

// // Additional rental company routes
// router.get("/rented-vehicles-count-by-company-users/:companyId", RentalCompany);
// router.get("/rental-company-data-by-admin/:id", RentalCompany);
// router.put("/update-rental-company/:id", RentalCompany);

// // Rental company payment route
// // router.post("/rental-company-payment", RentalCompanyPayment);

// // Rent-related routes
// router.post("/add-rent-by-company", RentalCompany);
// router.get("/vehicles-by-company", verifyTokenByCompany, RentalCompany);

const {
  CreateRentalCompany,
  RentalCompanyLogin,
  RentalCompanyDetails,
  AddRentByCompany,
  VehiclesByCompany,
  RentalCompanyData,
  RentalCompanyGetByID,
  rentalCompanyPayment,
  UpdateRentalCompanyByID,
  DeleteRentalCompanyDataWithID,
  RentedVehicleCountByCompanyUsersWithCompanyID,
  RentalCompanyDataByAdminWithID,
  RentalCompanyCountWithMembershipDetails,
  GetBookedVehiclesOfCompany,
} = require("../controllers/RentalCompanyController");

const { verifyTokenByCompany } = require("../middleware/authMiddleware");

// Define routes
router.post("/create-rental-company", CreateRentalCompany);
router.post("/rentalcompanylogin", RentalCompanyLogin);
router.get("/rentalcompanydetails", verifyTokenByCompany, RentalCompanyDetails);
router.post("/add-rent-by-company", AddRentByCompany);
router.get("/vehicles-by-company", verifyTokenByCompany, VehiclesByCompany);
router.get("/rental-company-data", RentalCompanyData);
router.get("/rental-company-data/:id", RentalCompanyGetByID);
router.post("/rental-company-payment", rentalCompanyPayment);
router.put("/update-rental-company/:id", UpdateRentalCompanyByID);
router.delete("/rental-company-data/:id", DeleteRentalCompanyDataWithID);
router.get(
  "/rented-vehicles-count-by-company-users/:companyId",
  RentedVehicleCountByCompanyUsersWithCompanyID
);
router.get("/rental-company-data-by-admin/:id", RentalCompanyDataByAdminWithID);
router.get(
  "/rental-companies-count-with-membership-details",
  RentalCompanyCountWithMembershipDetails
);
router.get(
  "/get-booked-vehicles-of-company",verifyTokenByCompany,
  GetBookedVehiclesOfCompany
);

module.exports = router;
