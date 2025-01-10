// actions/AdminActions.js
import {
  ADMIN_VEHICLES_ON_SALE_REQUEST,
  ADMIN_VEHICLES_ON_SALE_SUCCESS,
  ADMIN_VEHICLES_ON_SALE_FAIL,
} from "../constants/adminConstants";

export const fetchAdminVehiclesOnSale = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_VEHICLES_ON_SALE_REQUEST });

    const response = await fetch("http://localhost:5000/admin-vehicle-on-sale");
    const data = await response.json();

    dispatch({
      type: ADMIN_VEHICLES_ON_SALE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_VEHICLES_ON_SALE_FAIL,
      payload: error.message || "Failed to fetch vehicles on sale",
    });
  }
};
