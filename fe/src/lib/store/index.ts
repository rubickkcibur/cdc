import { createStore, applyMiddleware, combineReducers } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import { ReducerState } from "react"
import { PAGlobalReducer } from "../state/global"
import { TypedUseSelectorHook, useSelector } from "react-redux"
import logger from "redux-logger"

const reducer = combineReducers({ PAGlobalReducer })

export type RootState = ReducerState<typeof reducer>

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector

export const initializeStore = () => {
  return createStore(reducer, composeWithDevTools(applyMiddleware(logger)))
}
