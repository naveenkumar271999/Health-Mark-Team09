import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Add new Product
export const addProduct = createAsyncThunk('product/addProduct', async (product, { rejectWithValue, getState }) => {
    try {
        const response = await fetch('http://localhost:3000/api/product/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getState().auth.token}`,
            },
            body: JSON.stringify(product),
        });
        if (!response.ok) {
            const message = await response.json();
            return { ...message, status: response.status };
        }
        else {
            const data = await response.json();
            return rejectWithValue({ ...data, status: response.status });
        }
    } catch (error) {
        return rejectWithValue({ message: 'Something went wrong!', status: 500 });
    }
});

// Get all Products
export const getProducts = createAsyncThunk('product/getProducts', async (_, { getState }) => {
    try {
        const response = await fetch('http://localhost:3000/api/product/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getState().auth.token}`,
            },
        });
        if (!response.ok) {
            const message = await response.json();
            return { ...message, status: response.status };
        }
        else {
            const data = await response.json();
            return { ...data, status: response.status }
        }
    } catch (error) {
        return { message: 'Something went wrong!', status: 500 };
    }
});

// Get Product by ID
export const getProductById = createAsyncThunk('product/getProductById', async (id, { getState }) => {
    try {
        const response = await fetch(`http://localhost:3000/api/product/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getState().auth.token}`,
            },
        });
        if (!response.ok) {
            const message = await response.json();
            return { ...message, status: response.status };
        }
        else {
            const data = await response.json();
            return { ...data, status: response.status }
        }
    } catch (error) {
        return { message: 'Something went wrong!', status: 500 };
    }
});

// Update Product
export const updateProduct = createAsyncThunk('product/updateProduct', async (product, { rejectWithValue, getState }) => {
    try {
        const response = await fetch(`http://localhost:3000/api/product/${product._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getState().auth.token}`,
            },
            body: JSON.stringify(product),
        });
        if (!response.ok) {
            const message = await response.json();
            return { ...message, status: response.status };
        }
        else {
            const data = await response.json();
            return { ...data, status: response.status };
        }
    } catch (error) {
        return rejectWithValue({ message: 'Something went wrong!', status: 500 });
    }
});

// Delete Product
export const deleteProduct = createAsyncThunk('product/deleteProduct', async (id, { getState }) => {
    try {
        const response = await fetch(`http://localhost:3000/api/product/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getState().auth.token}`,
            },
        });
        if (!response.ok) {
            const message = await response.json();
            return { ...message, status: response.status };
        }
        else {
            return { message: 'Product deleted successfully!', status: response.status }
        }
    } catch (error) {
        return { message: 'Something went wrong!', status: 500 };
    }
});

const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        product: {},
        status: null,
        message: null,
        loading: false,
    },
    reducers: {
        clearMessage(state) {
            state.message = null;
        },
        updateProductLocally(state, payload) {
            state.products = state.products.filter((product_) => product_._id !== payload.payload._id);
            state.products.unshift(payload.payload);
        },
        deleteProductLocally(state, payload) {
            state.products = state.products.filter((product_) => product_._id !== payload.payload);
        },
        addProductLocally(state, { product }) {
            state.products.unshift(product); 
        }
    },
    extraReducers: {
        [addProduct.pending]: (state) => {
            state.status = 'loading';
            state.loading = true;
        },
        [addProduct.fulfilled]: (state, { payload }) => {
            state.status = payload.status;
            state.message = payload.message;
            console.log(payload);
            const newProducts = state.products.filter((product) => product._id !== payload.product._id);
            newProducts.unshift(payload.product);
            state.products = newProducts;
            state.loading = false;
        },
        [addProduct.rejected]: (state, { payload }) => {
            state.status = payload.status;
            state.message = payload.message;
            state.loading = false;
        },
        [getProducts.pending]: (state) => {
            state.status = 'loading';
            state.loading = true;
        },
        [getProducts.fulfilled]: (state, { payload }) => {
            state.status = payload.status;
            state.products = payload.products;
            state.loading = false;
        },
        [getProducts.rejected]: (state, { payload }) => {
            state.status = payload.status;
            state.message = payload.message;
            state.loading = false;
        },
    },
});

export const { clearMessage } = productSlice.actions;
export default productSlice.reducer;
export const selectProducts = (state) => state.product.products;
export const { updateProductLocally, deleteProductLocally, addProductLocally } = productSlice.actions;