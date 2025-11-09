import { combineReducers, configureStore } from "@reduxjs/toolkit";
import dataReducer from "./slices/dataSlice";
import filterReducer from "./slices/filterSlice"



const rootReducer = combineReducers({
    filter: filterReducer,
    ourSolarPanels: dataReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export default store;
