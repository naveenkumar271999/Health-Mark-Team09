import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const login = createAsyncThunk('auth/login', async (credentials, { getState }) => {
    try {
        const response = await fetch('http://localhost:3000/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const message = await response.json();
            return { ...message, status: response.status };
        }
        else {
            const data = await response.json();
            const { token } = data;
            localStorage.setItem('authToken', token);
            localStorage.setItem('reduxState', JSON.stringify({
            auth: {
             user: data.user,
             token: token,
             isAuthenticated: true,
            },
      }));
   return { ...data, status: response.status }
        }
    } catch (error) {
        return { message: 'Something went wrong!', status: 500 };
    }
});

export const register = createAsyncThunk('auth/register', async (credentials) => {
    try {
        const response = await fetch('http://localhost:3000/api/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
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

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue, getState }) => {
    try {
        const response = await fetch('http://localhost:3000/api/user/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getState().auth.token}`,
            },
        });
        
        if (response.status === 200) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('reduxState');
            return await response.json();
        }
        else {
            return rejectWithValue(await response.json());
        }

    } catch (error) {
        return rejectWithValue(error.message);
    }
});


export const sendVerificationEmail = createAsyncThunk('auth/sendVerificationEmail', async (email, { rejectWithValue }) => {
    try {
        const response = await fetch('http://localhost:3000/api/user/resend-verification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        if (response.status === 200) {
            return await response.json();
        }
        else {
            return rejectWithValue(await response.json());
        }
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// send password reset email
export const sendPasswordResetEmail = createAsyncThunk('auth/sendPasswordResetEmail', async (email, { rejectWithValue }) => {
    try {
        const response = await fetch('http://localhost:3000/api/user/sendPasswordResetEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        if (response.status === 200) {
            return await response.json();
        }
        else {
            return rejectWithValue(await response.json());
        }
    } catch (error) {
        return rejectWithValue(error.message);
    }
});


export const resetPassword = createAsyncThunk('auth/resetPassword', async (data, { rejectWithValue }) => {
    try {
        const response = await fetch(`http://localhost:3000/api/user/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: data.password, passwordResetToken: data.passwordResetToken }),
        });
        if (response.status === 200) {
            return await response.json();
        }
        else {
            return rejectWithValue(await response.json());
        }
    } catch (error) {
        return rejectWithValue(error.message);
    }
});



// Initial State
const initialState = {
    user: null,
    loading: false,
    isAuthenticated: false,
    token: null,
};

// Auth Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.status === 200) {
                    state.user = action.payload.user;
                    state.isAuthenticated = true;
                    state.token = action.payload.token;
                    state.loading = false;
                }
            })
            .addCase(login.rejected, (state) => {
                state.loading = false;
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
            })
            .addCase(register.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(register.rejected, (state) => {
                state.loading = false;
            })
            .addCase(logout.pending, (state) => {
                state.loading = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.token = null;
            })
            .addCase(logout.rejected, (state) => {
                state.loading = false;
            })
    },
});

// Export Actions and Reducer
export const { setLoading } = authSlice.actions;
export const { setUser } = authSlice.actions;
export default authSlice.reducer;
