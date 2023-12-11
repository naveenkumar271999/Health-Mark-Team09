import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createSelector } from 'reselect';

// create category thunk
export const createCategory = createAsyncThunk(
    'categories/createCategory',
    async (category, { rejectWithValue, getState }) => {
        try {
            const response = await fetch('http://localhost:3000/api/category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getState().auth.token,
                },
                body: JSON.stringify(category),
            });
            const data = await response.json();
            if (response.status !== 200) {
                return rejectWithValue({ status: 503, ...data });
            }
            return { status: 200, ...data };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// get categories thunk
export const getCategories = createAsyncThunk(
    'categories/getCategories',
    async (_, { rejectWithValue, getState }) => {
        try {
            const response = await fetch('http://localhost:3000/api/category', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getState().auth.token,
                },
            });
            const data = await response.json();
            if (response.status !== 200) {
                return rejectWithValue({ status: 500, ...data });
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// update category thunk
export const updateCategory = createAsyncThunk(
    'categories/updateCategory',
    async (category, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:3000/api/category/${category._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(category),
            });
            const data = await response.json();
            if (!response.ok) {
                return rejectWithValue(data);
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// initial state
const initialState = {
    categories: [],
    loading: false,
    error: null,
};


// delete category thunk
export const deleteCategory = createAsyncThunk(
    'categories/deleteCategory',
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:3000/api/category/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (!response.ok) {
                return rejectWithValue(data);
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// category slice
const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        clearCategories: (state) => {
            state.categories = [];
        },
        addCategory: (state, action) => {
            state.categories.push(action.payload);
        },
        removeCategory: (state, action) => {
            state.categories = state.categories.filter(category => category._id !== action.payload);
        },
        updateCategory: (state, action) => {
            const index = state.categories.findIndex(category => category._id === action.payload._id);
            state.categories[index] = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload.categories;
            });
    }
});

export default categorySlice.reducer;
export const { addCategory, removeCategory } = categorySlice.reducer;
const selectCategorySlice = state => state.categories;
export const selectCategories = createSelector([selectCategorySlice], category => category.categories);
