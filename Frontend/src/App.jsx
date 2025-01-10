// import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Home from './pages/Home.jsx'; // assuming it's in pages folder
import BuyerLogin from './Buyer/BuyerLogin.jsx';
import Search from './Search/Search.jsx';
import Sell from './Seller/Sell.jsx';
import Rent from './Buyer/Rent.jsx';
import Buy from './Buyer/Buy.jsx';
import SellerLogin from './Seller/SellerLogin.jsx';
import SelectUserType from './SelectUserType.jsx';
import AdminLogin from './Admin/AdminLogin.jsx';
import BuyerDashBoard from './Buyer/BuyerDashBoard.jsx';
import SellerDashBoard from './Seller/SellerDashBoard.jsx';
import AdminDashBoard from './Admin/AdminDashBoard.jsx';
import VehiclesOnRent from './Admin/VehiclesOnRent.jsx';
import VehiclesOnSale from './Admin/VehiclesOnSale.jsx';
import RentedVehicles from './Admin/RentedVehicles.jsx';
import AddRent from './Seller/AddRent.jsx';
import SearchResults from './Cards/SearchResults.jsx';
import GetRentDetails from './Seller/GetRentDetails.jsx';
import BuyerRentedVehciles from './Buyer/BuyerRentedVehicles.jsx';
import BuyerRentCard from './Cards/RentDetailsCard.jsx';
import GetSellDetails from './Seller/GetSellDetails.jsx';
import BuyerData from './Admin/BuyersData.jsx';
import Sellers from './Admin/SellersData.jsx'
import BuyerMembershipPayment from './Buyer/BuyerMembershipPayment.jsx';
import RentalCompanyLogin from './RentalCompany/RentalCompnayLogin.jsx';
import RentalCompanyData from './Admin/RentalCompanyData.jsx';
import CreateRentalCompany from './Admin/CreateRentalCompany.jsx';
import RentalCompanyDashBoard from './RentalCompany/RentalCompanyDashBoard.jsx';
import RentalCompanyMembershipPayment from './RentalCompany/RentalCompanyMembershipPayment.jsx';
import AddRentByCompany from './RentalCompany/AddRentByCompany.jsx';
import GetRentDetailsByCompany from './RentalCompany/GetRentDetailsByCompany.jsx';
import AddBuyerByAdmin from './Admin/AddBuyerByAdmin.jsx'; 
import UpdateBuyer from './Admin/UpdateBuyer.jsx';
import AddSellerByAdmin from './Admin/AddSellerByAdmin.jsx';
import UpdateSeller from './Admin/UpdateSeller.jsx';
import UpdateRentalCompany from './Admin/UpdateRentalCompany.jsx';
import AddCompanyByAdmin from './Admin/AddCompanyByAdmin.jsx';
import SellerMembership from './Seller/SellerMembership.jsx';
import BuyerMembershipSelection from './Buyer/BuyerMembershipSelection.jsx';
import RentalCompanyMembershipSelection from './RentalCompany/RentalCompanyMembershipSelection.jsx'
import SellerMembershipSelection from './Seller/SellerMembershipSelection.jsx';
import FakePayment from './Buyer/BuyerFakePayment.jsx';
import FAQ from './FAQ.jsx';
import BookedVehicles from './Seller/BookedVehicles.jsx';
import BookedVehiclesCompany from './RentalCompany/BookedVehiclesOfComapny.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buyer-login" element={<BuyerLogin />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/seller-login" element={<SellerLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/search" element={<Search />} />
        <Route path="/results" element={<SearchResults />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/addRent" element={<AddRent />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/selectUserType" element={<SelectUserType />} />
        <Route path="/buyerDashBoard" element={<BuyerDashBoard />} />
        <Route path="/seller-dashBoard" element={<SellerDashBoard />} />
        <Route path="/adminDashBoard" element={<AdminDashBoard />} />
        <Route path="/vehicles-on-rent" element={<VehiclesOnRent />} />
        <Route path="/rented-vehicles" element={<RentedVehicles />} />
        <Route path="/vehicles-on-sale" element={<VehiclesOnSale />} />
        <Route path="/getRentDetails" element={<GetRentDetails />} />
        <Route path="/buyerRentedVehicles" element={<BuyerRentedVehciles />} />
        <Route path="/buyerRentCard" element={<BuyerRentCard />} />
        <Route path="/getSellDetails" element={<GetSellDetails />} />
        <Route path="/buyers-data" element={<BuyerData />} />
        <Route path="/buyerMembershipPayment" element={<BuyerMembershipPayment />} />
        <Route path="/sellers-data" element={<Sellers />} />
        <Route path="/rental-company-login" element={<RentalCompanyLogin />} />
        <Route path="/rental-company-data" element={<RentalCompanyData />} />
        <Route path="/create-rental-company" element={<CreateRentalCompany />} />
        <Route path="/rental-company-dashboard" element={<RentalCompanyDashBoard />} />
        <Route path="/rentalCompanyMembershipPayment" element={<RentalCompanyMembershipPayment />} />
        <Route path="/addrentbycompany" element={<AddRentByCompany />} />
        <Route path="/getRentDetailsByCompany" element={<GetRentDetailsByCompany />} />
        <Route path="/addBuyerByAdmin" element={<AddBuyerByAdmin />} />
        <Route path="/update-buyer/:id" element={<UpdateBuyer />} />
        <Route path="/update-seller/:id" element={<UpdateSeller />} />
        <Route path="/addSellerByAdmin" element={<AddSellerByAdmin />} />
        <Route path="/update-rental-company/:id" element={<UpdateRentalCompany />} />
        <Route path="/addCompanyByAdmin" element={<AddCompanyByAdmin />} />
        <Route path="/seller-membership" element={<SellerMembership />} />
        <Route path="/buyer-membership-selection" element={<BuyerMembershipSelection />} />
        <Route path="/rental-company-membership-selection" element={<RentalCompanyMembershipSelection />} />
        <Route path="/seller-membership-selection" element={<SellerMembershipSelection />} />
        <Route path='/fakePayment' element={<FakePayment />}></Route>
        <Route path='/booked-vehicles' element={<BookedVehicles />}></Route>
        <Route path='/booked-vehicles-company' element={<BookedVehiclesCompany />}></Route>
       

      </Routes>
    </Router>
  );
}

export default App;
