import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
//const userFromStorage = localStorage.getItem("user");
const AUTH_ENDPOINT = `${import.meta.env.VITE_API_ENDPOINT}/auth`;

let parsedUser = {
  id: "",
  username: "",
  email: "",
  picture: "",
  status: "",
  token: "",
};

try {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    parsedUser = JSON.parse(storedUser);
  }
} catch (err) {
  console.error("Failed to parse user from localStorage:", err);
  localStorage.removeItem("user"); // Clean up bad data
}

const initialState = {
  user: parsedUser,
  status: "",
  error: "",
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (values, { rejectWithValue }) => {
    try {
      console.log("Registering with values:", values);
      const { data } = await axios.post(`${AUTH_ENDPOINT}/register`, {
        ...values,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (values, { rejectWithValue }) => {
    try {
      console.log("Logging in with values:", values);
      const { data } = await axios.post(`${AUTH_ENDPOINT}/login`, {
        ...values,
      });
      return {
        user: {
          ...data.user,
          token: data.accessToken, // <-- this is the important part
        },
      };
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.status = "";
      state.error = "";
      state.user = {
        id: "",
        name: "",
        email: "",
        picture: "",
        status: "",
        token: "",
      };
    },
    changeStatus: (state, action) => {
      state.status = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = "";
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = "";
        state.user = action.payload.user;
        localStorage.setItem("user", JSON.stringify(action.payload.user)); // ← Add this
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
