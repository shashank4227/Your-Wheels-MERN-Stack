import {
  BUYER_DETAILS_REQUEST,
  BUYER_DETAILS_SUCCESS,
  BUYER_DETAILS_FAIL,
} from "../constants/buyerConstants";

export const getBuyerDetails = () => async (dispatch) => {
  try {
    dispatch({ type: BUYER_DETAILS_REQUEST });

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch("http://localhost:5000/getBuyerDetails", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    dispatch({
      type: BUYER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: BUYER_DETAILS_FAIL,
      payload: error.message || "Failed to fetch buyer details",
    });
  }
};
