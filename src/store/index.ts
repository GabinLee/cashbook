import { AnyAction, CombinedState, Reducer, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch } from 'react-redux'
import rootReducer, { RootStates } from './rootReducer'
import { useSelector } from 'react-redux'
import logger from 'redux-logger'

const store = configureStore({
  reducer: rootReducer as Reducer<CombinedState<RootStates>,AnyAction>,
  middleware: getDefaultMiddleware().concat(logger)
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootStates> = useSelector

export default store