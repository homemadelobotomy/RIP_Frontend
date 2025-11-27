import { combineReducers, configureStore } from "@reduxjs/toolkit";
import dataReducer from "./slices/dataSlice";
import filterReducer from "./slices/filterSlice"
import authReducer from "./slices/authSlice"
import solarpanelRequestReducer from "./slices/solarpanelRequestSlice"
import requestFilterReducer from "./slices/requestFilter"


const rootReducer = combineReducers({
    filter: filterReducer,
    ourSolarPanels: dataReducer,
    auth: authReducer,
    solarpanelRequest: solarpanelRequestReducer,
    requestFilter: requestFilterReducer
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export default store;
