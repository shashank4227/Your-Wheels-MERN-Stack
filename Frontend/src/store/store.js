import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk"; // Default import for redux-thunk
import { buyerReducer } from "../reducers/buyerReducer"; // Correct import
import { sellerReducer } from "../reducers/sellerReducer";
import { adminVehiclesOnSaleReducer } from "../reducers/adminReducer";

const rootReducer = combineReducers({
  buyer: buyerReducer, // Combining buyerReducer
  seller: sellerReducer,
  adminVehiclesOnSale: adminVehiclesOnSaleReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
