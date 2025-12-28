import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

let debounceTimer;

/* ================= UPLOAD CART ================= */
export const uploadCart = createAsyncThunk(
  "cart/uploadCart",
  async (_, thunkAPI) => {
    try {
      clearTimeout(debounceTimer);

      debounceTimer = setTimeout(async () => {
        const { cartItems } = thunkAPI.getState().cart;

        // ✅ GET CLERK TOKEN
        const token = await window.Clerk?.session?.getToken();

        await axios.post(
          "/api/cart",
          { cart: cartItems },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }, 800);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

/* ================= FETCH CART ================= */
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      const token = await window.Clerk?.session?.getToken();

      const { data } = await axios.get("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data.cart;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

/* ================= SLICE ================= */
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: {},
    total: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const { productId } = action.payload;
      state.cartItems[productId] =
        (state.cartItems[productId] || 0) + 1;
      state.total += 1;
    },
    removeFromCart: (state, action) => {
      const { productId } = action.payload;
      if (!state.cartItems[productId]) return;

      state.cartItems[productId] -= 1;
      state.total -= 1;

      if (state.cartItems[productId] === 0) {
        delete state.cartItems[productId];
      }
    },
    deleteItemFromCart: (state, action) => {
      const { productId } = action.payload;
      state.total -= state.cartItems[productId] || 0;
      delete state.cartItems[productId];
    },
    clearCart: (state) => {
      state.cartItems = {};
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.cartItems = action.payload || {};
      state.total = Object.values(state.cartItems).reduce(
        (acc, qty) => acc + qty,
        0
      );
    });
  },
});

export const {
  addToCart,
  removeFromCart,
  deleteItemFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;