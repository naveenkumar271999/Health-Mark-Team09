import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import categoryReducer from './slices/categoriesSlice';
import userReducer from './slices/userSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import thunk from 'redux-thunk';

const initialAuthState = {
    user: null,
    loading: false,
    isAuthenticated: false,
    token: null,
};

const initialState = {
    auth: initialAuthState,
};
const storedState = localStorage.getItem('reduxState');
const preloadedState = storedState ? JSON.parse(storedState) : initialState;

const store = configureStore({
    reducer: {
        auth: authReducer,
        categories: categoryReducer,
        users: userReducer,
        cart: cartReducer,
        products: productReducer,
    },
    preloadedState,
    middleware: [...getDefaultMiddleware(), thunk],
});

export default store;