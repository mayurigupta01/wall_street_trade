import { configureStore } from "@reduxjs/toolkit";
// import hotelReducer from "./hotelReducer";
// import selectedHotelReducer from "./selectedHotelReducer";
import buyReducer from "./buyReducer";
// import { setupListeners } from '@reduxjs/toolkit/query'
// import authReducer from "./authReducer";
import { applyMiddleware, createStore } from "redux";


export default configureStore({
  reducer: {
    symbol: buyReducer,
    buy_price: buyReducer,
    // user: authReducer, 
  }
});
