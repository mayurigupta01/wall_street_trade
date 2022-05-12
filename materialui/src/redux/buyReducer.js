import { createSlice } from "@reduxjs/toolkit";


    export const counterSlice = createSlice({
        name: "buy",
        initialState: {
            symbol: "",
            buy_price:0,
        },
        reducers: {
            SetbuyStockSymbol: (state, action) => {
                return { ...state, symbol: [action.payload] };
                console.log("buyStockSymbol: ", state);
            },

            SetbuyStockPrice: (state, action) => {
                return { ...state, buy_price: [action.payload] };
                console.log("buyStockPrice: ", state);
            },
        },

    });

export const { SetbuyStockSymbol, SetbuyStockPrice } = counterSlice.actions;

export default counterSlice.reducer;   