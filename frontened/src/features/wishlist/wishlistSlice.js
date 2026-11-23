
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    wishlistItems: [],
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,

    reducers: {

        addToWishlist: (state, action) => {
            const exists = state.wishlistItems.find(
                (item) => item.id === action.payload.id
            );

            if (!exists) {
                state.wishlistItems.push(action.payload);
            }
        },


        setWishlist: (state, action) => {
            state.wishlistItems = action.payload;
        },


        removeFromWishlist: (state, action) => {
            state.wishlistItems = state.wishlistItems.filter(
                (item) => item.id !== action.payload
            );
        },
    },
});

export const {
    addToWishlist,
    setWishlist,
    removeFromWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
