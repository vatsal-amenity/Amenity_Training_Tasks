import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import offerService from '../services/offerService';

const initialState = {
    offers: [],
    offer: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
    areOffersEnabled: true
}

//fetch offers
export const getOffers = createAsyncThunk('offers/getAll', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await offerService.getOffers(token);
    } catch (error) {
        const message = (error.message && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

//create offer
export const createOffer = createAsyncThunk('offers/create', async (offerData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await offerService.createOffer(offerData, token);
    } catch (error) {
        const message = (error.message && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

//update offer 
export const updateOffer = createAsyncThunk('offers/update', async ({ id, offerData }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await offerService.updateOffer(id, offerData, token);
    } catch (error) {
        const message = (error.message && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

//delete offer
export const deleteOffer = createAsyncThunk('offer/delete', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await offerService.deleteOffer(id, token);
    } catch (error) {
        const message = (error.message && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

//fetch global status
export const fetchGlobalOfferStatus = createAsyncThunk('offers/fetchGlobalStatus', async (_, thunkAPI) => {
    try {
        return await offerService.getGlobalOfferStatus();
    } catch (error) {
        const message = (error.message && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

//toggle global status
export const toggleGlobalOfferStatus = createAsyncThunk('offers/toggleGlobalStatus', async (status, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await offerService.toggleGlobalOfferStatus(status, token);
    } catch (error) {
        const message = (error.message && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


export const offerSlice = createSlice({
    name: 'offer',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
            // Do NOT reset offers or areOffersEnabled to keep UI consistent
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getOffers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getOffers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.offers = action.payload;
            })
            .addCase(getOffers.rejected, (state, action) => {
                state.isError = true;
                state.isLoading = false;
                state.message = action.payload;
            })
            .addCase(createOffer.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createOffer.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.offers.push(action.payload);
            })
            .addCase(createOffer.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateOffer.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateOffer.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const index = state.offers.findIndex(o => o._id === action.payload._id);
                if (index !== -1) {
                    state.offers[index] = action.payload;
                }
            })
            .addCase(updateOffer.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteOffer.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteOffer.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.offers = state.offers.filter((offer) => offer._id !== action.meta.arg);
            })
            .addCase(deleteOffer.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(fetchGlobalOfferStatus.fulfilled, (state, action) => {
                state.areOffersEnabled = action.payload?.value ?? true;
            })
            .addCase(toggleGlobalOfferStatus.fulfilled, (state, action) => {
                state.areOffersEnabled = action.payload?.value;
                state.isSuccess = true;
            });
    },
});

export const { reset } = offerSlice.actions;
export default offerSlice.reducer;

//check active offers and return the best discount price
export const getDiscountPrice = (product, offers, areOffersEnabled = true) => {
    // console.log('Checking discount for:', product?.name, 'Offers:', offers?.length);
    if (!areOffersEnabled) {
        return { finalPrice: product?.price || 0, discountPercentage: 0, isDiscounted: false };
    }

    if (!product || !offers || offers.length === 0) {
        return { finalPrice: product?.price || 0, discountPercentage: 0, isDiscounted: false };
    }

    const currentDate = new Date();

    //find applicable offers
    const validOffers = offers.filter(offer => {
        const startDate = new Date(offer.startDate);
        const endDate = new Date(offer.endDate);
        const isActive = offer.status && currentDate >= startDate && currentDate <= endDate;

        // console.log(`Offer: ${offer.name}, Active: ${isActive}`);

        if (!isActive)
            return false;
        if (offer.isAppliesToAll)
            return true;
        if (offer.products && offer.products.includes(product._id))
            return true;

        return false;
    });

    if (validOffers.length === 0) {
        return { finalPrice: product.price, discountPercentage: 0, isDiscounted: false };
    }

    //sort by highest disc
    validOffers.sort((a, b) => b.discountPercentage - a.discountPercentage);
    const bestOffer = validOffers[0];

    console.log('Best active offer:', bestOffer.name);

    const discountAmount = (product.price * bestOffer.discountPercentage) / 100;
    const finalPrice = product.price - discountAmount;

    return {
        finalPrice: Math.round(finalPrice),
        discountPercentage: bestOffer.discountPercentage,
        isDiscounted: true,
        offerName: bestOffer.name
    };
};