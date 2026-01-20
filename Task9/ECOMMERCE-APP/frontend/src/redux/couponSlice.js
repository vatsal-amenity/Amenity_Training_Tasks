import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import couponService from '../services/couponService';

const initialState = {
    coupons: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

//async thunks
// Get all coupons
export const getCoupons = createAsyncThunk('coupons/getAll', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await couponService.getCoupons(token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Create coupon
export const createCoupon = createAsyncThunk('coupons/create', async (couponData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await couponService.createCoupon(couponData, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Delete coupon
export const deleteCoupon = createAsyncThunk('coupons/delete', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await couponService.deleteCoupon(id, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Update coupon (Optional, if needed)
export const updateCoupon = createAsyncThunk('coupons/update', async ({ id, couponData }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await couponService.updateCoupon(id, couponData, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});




export const couponSlice = createSlice({
    name: 'coupon',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCoupons.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCoupons.fulfilled, (state, action) => {
                state.isLoading = false;
                state.coupons = action.payload;
            })
            .addCase(getCoupons.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createCoupon.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.coupons.push(action.payload);
            })
            .addCase(createCoupon.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteCoupon.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.coupons = state.coupons.filter((coupon) => coupon._id !== action.payload);
            })
            .addCase(updateCoupon.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const index = state.coupons.findIndex(c => c._id === action.payload._id);
                if (index !== -1) {
                    state.coupons[index] = action.payload;
                }
            });
    },
});

export const { reset } = couponSlice.actions;
export default couponSlice.reducer;
