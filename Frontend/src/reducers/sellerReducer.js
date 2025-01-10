import {
    SELLER_DETAILS_REQUEST,
    SELLER_DETAILS_SUCCESS,
    SELLER_DETAILS_FAIL,
  } from "../constants/sellerConstants";
  
  const initialState = {
    loading: false,
    userData: {
      isMember: false,
      membershipType: "",
    },
    error: null,
  };
  
  export const sellerReducer = (state = initialState, action) => {
    switch (action.type) {
      case SELLER_DETAILS_REQUEST:
        return { ...state, loading: true, error: null };
      case SELLER_DETAILS_SUCCESS:
        return { ...state, loading: false, userData: action.payload };
      case SELLER_DETAILS_FAIL:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  