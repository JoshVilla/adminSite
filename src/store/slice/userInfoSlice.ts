import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the UserInfo interface
interface IUserInfo {
  _id: string;
  username: string;
  password: string;
  isSuperAdmin: number;
  isActive: number;
}

// Initial state typing
interface IUserInfoState {
  userInfo: IUserInfo | null; // Can be null if no user info is available
}

// Define the initial state
const initialState: IUserInfoState = {
  userInfo: null, // No user initially
};

// Create the slice
const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    // Action to set user information
    getUserInfo: (state, action: PayloadAction<IUserInfo | null>) => {
      state.userInfo = action.payload; // Payload contains the user object directly
    },
  },
});

// Export actions and reducer
export const { getUserInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;
