import {
    SELLER_DETAILS_REQUEST,
    SELLER_DETAILS_SUCCESS,
    SELLER_DETAILS_FAIL,
  } from "../constants/sellerConstants";
  
  export const getSellerDetails = () => async (dispatch) => {
    try {
      dispatch({ type: SELLER_DETAILS_REQUEST });
  
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
  
      const response = await fetch("http://localhost:5000/getSellerDetails", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
  
      dispatch({
        type: SELLER_DETAILS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: SELLER_DETAILS_FAIL,
        payload: error.message || "Failed to fetch seller details",
      });
    }
  };
  