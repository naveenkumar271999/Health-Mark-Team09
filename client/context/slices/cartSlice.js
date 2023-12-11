import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// get Cart
export const getCart = createAsyncThunk('cart/getCart', async (_, { getState }) => {
    try {
        const response = await fetch('http://localhost:3000/api/cart/', {
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

// create Cart
export const createCart = createAsyncThunk('cart/createCart', async (_, { getState }) => {
    try {
        const response = await fetch('http://localhost:3000/api/cart/', {
            method: 'POST',
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

// add Item to Cart 
export const addItemToCart = createAsyncThunk('cart/addItemToCart', async (item, { rejectWithValue, getState }) => {
    try {
        const response = await fetch('http://localhost:3000/api/cart/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getState().auth.token}`,
            },
            body: JSON.stringify(item),
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

// update Item in Cart
export const updateItemInCart = createAsyncThunk('cart/updateItemInCart', async (item, { rejectWithValue, getState }) => {
    try {
        const response = await fetch(`http://localhost:3000/api/cart/items/${item._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getState().auth.token}`,
            },
            body: JSON.stringify(item),
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

// delete Item from Cart
export const deleteItemFromCart = createAsyncThunk('cart/deleteItemFromCart', async (id, { rejectWithValue, getState }) => {
    try {
        const response = await fetch(`http://localhost:3000/api/cart/items/${id}`, {
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
            const data = await response.json();
            return rejectWithValue({ ...data, status: response.status });
        }
    } catch (error) {
        return rejectWithValue({ message: 'Something went wrong!', status: 500 });
    }
});

// delete Cart
export const deleteCart = createAsyncThunk('cart/deleteCart', async (_, { getState }) => {
    try {
        const response = await fetch('http://localhost:3000/api/cart/', {
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
            const data = await response.json();
            return { ...data, status: response.status }
        }
    } catch (error) {
        return { message: 'Something went wrong!', status: 500 };
    }
});

// checkout Cart
export const checkoutCart = createAsyncThunk('cart/checkoutCart', async (_, { getState }) => {
    try {
        const cart = getState().cart.cart;
        const response = await fetch('http://localhost:3000/api/cart/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getState().auth.token}`,
            },
            body: JSON.stringify({ cart }), 
        });

        if (!response.ok) {
            const errorMessage = await response.text(); // Read the error message
            throw new Error(`Server responded with status ${response.status}: ${errorMessage}`);
        }

        const data = await response.json();
        return { ...data, status: response.status };
    } catch (error) {
        console.error('Error during checkout:', error);
        return { message: 'Something went wrong!', status: 500 };
    }
});


const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: [],
        status: null,
        message: null,
        length: 0,
    },
    reducers: {
        setCartLength: (state, action) => {
            state.length = action.payload;
        },
        addItemToCartLocally: (state, action) => {
            const item = action.payload;
            const existingItem = state.cart.items.find(i => i.product._id === item.product._id);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            }
            else {
                state.cart.items.push(item);
                state.length += 1;
            }
        },
        updateItemInCartLocally: (state, action) => {
            const newCart = action.payload;
            state.cart.items = newCart;
            state.length = newCart.length;
        },
        removeItemFromCartLocally: (state, action) => {
            const id = action.payload;
            state.cart.items = state.cart.items.filter(item => item.product._id !== id);
            state.length -= 1;
        },
        clearCartLocally: (state) => {
            state.cart.items = [];
            state.length = 0;
        },
    },
    extraReducers: {
        [getCart.pending]: (state) => {
            state.status = 'loading';
        },
        [getCart.fulfilled]: (state, action) => {
            state.status = 'success';
            state.cart = action.payload;
        },
        [getCart.rejected]: (state, action) => {
            state.status = 'failed';
            state.message = action.payload.message;
        },
        [createCart.pending]: (state) => {
            state.status = 'loading';
        },
        [createCart.fulfilled]: (state, action) => {
            state.status = 'success';
            state.cart = action.payload;
        },
        [createCart.rejected]: (state, action) => {
            state.status = 'failed';
            state.message = action.payload.message;
        },
        [addItemToCart.pending]: (state) => {
            state.status = 'loading';
        },
        [addItemToCart.fulfilled]: (state, action) => {
            state.status = 'success';
            state.cart = action.payload;
        },
        [addItemToCart.rejected]: (state, action) => {
            state.status = 'failed';
            state.message = action.payload.message;
        },
        [updateItemInCart.pending]: (state) => {
            state.status = 'loading';
        },
        [updateItemInCart.fulfilled]: (state, action) => {
            state.status = 'success';
            state.cart = action.payload;
        },
        [updateItemInCart.rejected]: (state, action) => {
            state.status = 'failed';
            state.message = action.payload.message;
        },
        [deleteItemFromCart.pending]: (state) => {
            state.status = 'loading';
        },
        [deleteItemFromCart.fulfilled]: (state, action) => {
            state.status = 'success';
            state.cart = action.payload;
        },
        [deleteItemFromCart.rejected]: (state, action) => {
            state.status = 'failed';
            state.message = action.payload.message;
        },
        [deleteCart.pending]: (state) => {
            state.status = 'loading';
        },
        [deleteCart.fulfilled]: (state) => {
            state.status = 'success';
            state.cart.items = [];
            state.length = 0;
        },
        [deleteCart.rejected]: (state, action) => {
            state.status = 'failed';
            state.message = action.payload.message;
        }
    },
});

export default cartSlice.reducer;
export const {setCartLength, addItemToCartLocally, updateItemInCartLocally, removeItemFromCartLocally, clearCartLocally } = cartSlice.actions;

