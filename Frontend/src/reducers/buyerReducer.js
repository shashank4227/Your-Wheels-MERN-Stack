import {
  BUYER_DETAILS_REQUEST,
  BUYER_DETAILS_SUCCESS,
  BUYER_DETAILS_FAIL,
} from "../constants/buyerConstants";

const initialState = {
  loading: false,
  userData: {
    isMember: false,
    membershipType: "",
  },
  error: null,
};

export const buyerReducer = (state = initialState, action) => {
  switch (action.type) {
    case BUYER_DETAILS_REQUEST:
      return { ...state, loading: true, error: null };
    case BUYER_DETAILS_SUCCESS:
      return { ...state, loading: false, userData: action.payload };
    case BUYER_DETAILS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
