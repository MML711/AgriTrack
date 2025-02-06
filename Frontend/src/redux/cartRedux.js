import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
    quantity: 0,
    total: 0,
  },
  reducers: {
    addProduct: (state, action) => {
      const productIndex = state.products.findIndex((p) => p.id === action.payload.id);
      
      if (productIndex !== -1) {
        state.products[productIndex].quantity = state.products[productIndex].quantity + action.payload.quantity;
      } else {
        state.products.push(action.payload);
        state.quantity += 1;
      }
      state.total += action.payload.price * action.payload.quantity;
    },
    removeProduct: (state, action) => {
      const productIndex = state.products.findIndex((p) => p.id === action.payload.id);
      
      state.total -= state.products[productIndex].price * state.products[productIndex].quantity;
      state.products.splice(productIndex, 1); // Use `productIndex` here
      state.quantity -= 1;
    },
  },
});

export const {addProduct, removeProduct} = cartSlice.actions;
export default cartSlice.reducer;