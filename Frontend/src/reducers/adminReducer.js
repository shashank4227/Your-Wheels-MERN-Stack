// reducers/AdminReducer.js
import {
  ADMIN_VEHICLES_ON_SALE_REQUEST,
  ADMIN_VEHICLES_ON_SALE_SUCCESS,
  ADMIN_VEHICLES_ON_SALE_FAIL,
} from "../constants/adminConstants";

const initialState = {
  loading: false,
  vehicles: [],
  error: null,
};

export const adminVehiclesOnSaleReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADMIN_VEHICLES_ON_SALE_REQUEST:
      return { ...state, loading: true, error: null };
    case ADMIN_VEHICLES_ON_SALE_SUCCESS:
      return { ...state, loading: false, vehicles: action.payload };
    case ADMIN_VEHICLES_ON_SALE_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
