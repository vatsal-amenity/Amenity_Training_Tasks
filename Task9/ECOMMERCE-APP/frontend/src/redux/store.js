import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import productReducer from "./productSlice";
import cartReducer from "./cartSlice";
import offerReducer from './offerSlice';
import couponReducer from './couponSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        cart: cartReducer,
        offer: offerReducer,
        coupon: couponReducer,
    },
});