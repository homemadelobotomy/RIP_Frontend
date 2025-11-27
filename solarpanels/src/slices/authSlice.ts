import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';

interface AuthState {
  token: string | null;
  login: string | null;
  isModerator: boolean;
  isAuth: boolean;
  loading: boolean;
}
localStorage.removeItem('token');

const initialState: AuthState = {
  token: null,
  login: null,
  isModerator: false,
  isAuth: false,
  loading: false,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { login: string; password: string }) => {
    const response = await api.login.loginCreate(credentials);
    return { ...response.data, login: credentials.login };
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials: { login: string; password: string }, {rejectWithValue}) => {
    try {
      const response = await api.user.registrationCreate(credentials);
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message;
      return rejectWithValue(message);
    }
  }
);

export const updateUserLogin = createAsyncThunk(
  'auth/updateLogin',
  async (newLogin: string, { rejectWithValue }) => {
    try {
      const response = await api.user.userUpdate({ login: newLogin });
      return response.data;
    } catch (error: any) {
      const message = error?.response?.status == 500? "Пользователь с таким логином уже существует" : "Ошибка изменения логина";
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await api.logout.logoutCreate();

});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.access_token || null;
        state.login = action.payload.login;
        state.isModerator = action.payload.is_moderator || false;
        state.isAuth = true;
        state.loading = false;
        if (action.payload.access_token) {
          localStorage.setItem('token', action.payload.access_token);
          api.setSecurityData(action.payload.access_token);
        }
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.login = action.payload.login || null;
      })
       .addCase(updateUserLogin.fulfilled, (state, action) => {
        state.login = action.payload.login || null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.login = null;
        state.isModerator = false;
        state.isAuth = false;
        localStorage.removeItem('token');
        api.setSecurityData(null);
      });
  },
});

export default authSlice.reducer;
