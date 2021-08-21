import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    products: [],
    cart: [],
    cartOpen: false,
    categories: [],
    currentCategory: ''
};

const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        updateProducts(state, action) {
            state.products = action.payload.products;
        },
        updateCategories(state, action) {
            state.categories = action.payload.categories;
        },
        updateCurrentCategory(state, action) {
            state.currentCategory = action.payload;
        },
        addToCart(state, action) {
            state.cartOpen = true;
            state.cart.push(action.payload);
        },
        addMultipleToCart(state, action) {
            state.cart.push(...action.payload);
        },
        removeFromCart(state, action) {
            let filteredProducts = state.cart.filter(product => {
                return product._id !== action.payload._id;
            });
            state.cartOpen = filteredProducts.length > 0;
            state.cart = filteredProducts;
        },
        updateCartQuantity(state, action) {
            state.cartOpen = true;
            state.cart = state.cart.map(product => {
                if (action.payload._id === product._id) {
                    product.purchaseQuantity = action.payload.purchaseQuantity;
                }
                return product;
            })
        },
        clearCart(state) {
            state.cartOpen = false;
            state.cart = [];
        },
        toggleCart(state) {
            state.cartOpen = !state.cartOpen;
        }
    }
})

export const { 
    updateProducts, 
    updateCategories, 
    updateCurrentCategory, 
    addToCart, 
    addMultipleToCart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart, 
    toggleCart 
} = globalSlice.actions;

export const selectGlobal = state => state.global;
export default globalSlice.reducer
