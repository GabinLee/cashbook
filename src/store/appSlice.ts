import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import User from "../models/UserModel";


export interface InitState {
  user?: User|null
  token?: string|null
}

const appSlice = createSlice({
  name: 'cashbook',  // reducer의 이름 지정
  initialState: { 
  } as InitState,  // 초깃값
  reducers: {
    setUser: (state, action: PayloadAction<User|null>) => {
      state.user = action.payload
    },
    setToken: (state, action: PayloadAction<string|null>) => {
      state.token = action.payload
    },
  }
});

export const {
  setUser, setToken
} = appSlice.actions

export default appSlice.reducer