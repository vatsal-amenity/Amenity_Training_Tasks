import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from 'sonner';
import cartService from '../services/cartService';
import couponService from "../services/couponService";

const initialState = {
  cartItems: [],
  cartTotal: 0,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  coupon: null,
  isCouponLoading: false,
  couponError: "",
  couponSuccess: false,
};

//async thunks
//get cart
export const getCart = createAsyncThunk("cart/getCart", async (_, thunkAPI) => {
  try {
    return await cartService.getCart();
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

//add cart
export const addToCart = createAsyncThunk('cart/addToCart', async (productData, thunkAPI) => {
  try {
    return await cartService.addToCart(productData);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message
    ) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

//update cart
export const updateCartItemQty = createAsyncThunk('cart/updateCartItemQty', async ({ productId, qty }, thunkAPI) => {
  try {
    return await cartService.updateCartItemQty(productId, qty);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

//remove cart
export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (productId, thunkAPI) => {
  try {
    await cartService.removeFromCart(productId);
    return productId; //return id to filter out locally if need or re-fetch cart
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

//clear cart
export const clearCart = createAsyncThunk('cart/clearCart', async (_, thunkAPI) => {
  try {
    return await cartService.clearCart();
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

//apply coupon
export const applyCoupon = createAsyncThunk('cart/applyCoupon', async ({ code, cartTotal }, thunkAPI) => {
  try {
    return await couponService.validateCoupon({ code, cartTotal });
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});


const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder
      //get cart
      .addCase(getCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.cartItems = action.payload.cartItems || action.payload || [];
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      //add to cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cartItems = action.payload.cartItems || action.payload || state.cartItems;

        toast.success("Item added to cart");
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message = action.payload;
        toast.error(action.payload);
      })

      //update qty
      .addCase(updateCartItemQty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        if (action.payload.cartItems) {
          state.cartItems = action.payload.cartItems;
        } else if (Array.isArray(action.payload)) {
          state.cartItems = action.payload;
        }
      })
      .addCase(updateCartItemQty.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      //remove from cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cartItems = state.cartItems.filter((x) =>
          x._id !== action.payload &&
          (typeof x.product === "object" ? x.product?._id !== action.payload : x.product !== action.payload)
        );
        toast.success("Item removed from cart");
      })

      //clear cart
      .addCase(clearCart.fulfilled, (state) => {
        state.cartItems = [];
        state.isSuccess = true;
      })

      .addCase(applyCoupon.pending, (state) => {
        state.isCouponLoading = true;
        state.couponError = "";
        state.couponSuccess = false;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.isCouponLoading = false;
        state.couponSuccess = true;
        state.coupon = action.payload;
        toast.success("Coupon applied successfully!");
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.isCouponLoading = false;
        state.couponError = action.payload;
        state.coupon = null;
        toast.error(action.payload);
      });
  },
});

export const { reset } = cartSlice.actions;
export default cartSlice.reducer;