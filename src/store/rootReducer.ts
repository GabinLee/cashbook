import { AnyAction, CombinedState, combineReducers } from "@reduxjs/toolkit";
import app, { InitState } from "./appSlice";

export interface RootStates {
	app: InitState;
}


const reducer = (state: RootStates, action: AnyAction): CombinedState<RootStates> => combineReducers({
  app
})(state, action)


export type ReducerType = ReturnType<typeof reducer>;

export default reducer;