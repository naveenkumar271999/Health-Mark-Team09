import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Add new User
export const addUser = createAsyncThunk('user/addUser', async (user, { rejectWithValue, getState }) => {
    try {
        const response = await fetch('http://localhost:3000/api/user/addNewUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getState().auth.token}`,
            },
            body: JSON.stringify(user),
        });
        if (response.status === 200) {
            const data = await response.json();
            return { ...data, status: response.status };
        } else {
            const message = await response.json();
            return { ...message, status: response.status };
        }
    } catch (error) {
        return rejectWithValue({ message: 'Something went wrong!', status: 500 });
    }
});

// Get all Users
export const getUsers = createAsyncThunk('user/getUsers', async (_, { getState }) => {
    try {
        const response = await fetch('http://localhost:3000/api/user/', {
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

// Get User by ID
export const getUserById = createAsyncThunk('user/getUserById', async (id, { getState }) => {
    try {
        const response = await fetch(`http://localhost:3000/api/user/${id}`, {
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

// Update User
export const updateUser = createAsyncThunk('user/updateUser', async (user, { getState }) => {
    try {
        const response = await fetch(`http://localhost:3000/api/user/${user._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getState().auth.token}`,
            },
            body: JSON.stringify(user),
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

// Delete User
export const deleteUser = createAsyncThunk('user/deleteUser', async (id, { getState }) => {
    try {
        const response = await fetch(`http://localhost:3000/api/user/${id}`, {
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

export const bookAppointment = createAsyncThunk('user/bookAppointment', async (appointment, { getState }) => {
    try {
        const response = await fetch('http://localhost:3000/api/user/book-appointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getState().auth.token}`,
            },
            body: JSON.stringify(appointment),
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


const userSlice = createSlice({
    name: 'user',
    initialState: {
        users: [],
        user: {},
        status: null,
        error: null,
        loading: false,
    },
    reducers: {
        updateUserLocally(state, action) {
            const { payload } = action;
            const newUsers = state.users.filter((user) => user._id !== payload._id);
            newUsers.push(payload);
            state.users = newUsers;
        },
        deleteUserLocally(state, action) {
            const { payload } = action;
            state.users = state.users.filter((user) => user._id !== payload._id);
        },
        addUserLocally(state, action) {
            const { payload } = action;
            state.users.push(payload);
        }
    },
    extraReducers: {
        [addUser.pending]: (state) => {
            state.status = 'loading';
            state.loading = true;
        },
        [addUser.fulfilled]: (state, { payload }) => {
            state.status = 'success';
            if(payload?.status === 200)
            {
                state.user = payload.user;
                state.users.push(payload.user);
                state.loading = false;
                return;
            }
            state.loading = false;
        },
        [addUser.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
            state.loading = false;
        },
        [getUsers.pending]: (state) => {
            state.status = 'loading';
            state.loading = true;
        },
        [getUsers.fulfilled]: (state, { payload }) => {
            state.status = 'success';
            state.users = payload.users;
            state.loading = false;
        },
        [getUsers.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
            state.loading = false;
        },
        [getUserById.pending]: (state) => {
            state.status = 'loading';
            state.loading = true;
        },
        [getUserById.fulfilled]: (state, { payload }) => {
            state.status = 'success';
            state.user = payload;
            state.loading = false;
        },
        [getUserById.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
            state.loading = false;
        },
        [updateUser.pending]: (state) => {
            state.status = 'loading';
            state.loading = true;
        },
        [updateUser.fulfilled]: (state, { payload }) => {
            state.status = 'success';
            const { user } = payload;
            state.user = user;
            const newUsers = state.users.filter((user) => user._id !== payload.user._id);
            newUsers.unshift(user);
            state.users = newUsers;
            state.loading = false;
        },
        [updateUser.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
            state.loading = false;
        },
        [deleteUser.pending]: (state) => {
            state.status = 'loading';
            state.loading = true;
        },
        [deleteUser.fulfilled]: (state, { payload }) => {
            state.status = 'success';
            const { user } = payload;
            const newUsers = state.users.filter((user_) => user_._id !== user._id);
            state.users = newUsers;
            state.loading = false;
        },
        [deleteUser.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
            state.loading = false;
        },
        [bookAppointment.pending]: (state) => {
            state.status = 'loading';
            state.loading = true;
        },
        [bookAppointment.fulfilled]: (state, { payload }) => {
            state.status = 'success';
            state.user = payload;
            state.loading = false;
        },
        [bookAppointment.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
            state.loading = false;
        },
    }
});

export default userSlice.reducer;
export const { setLoading } = userSlice.actions;