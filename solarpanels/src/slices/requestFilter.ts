import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../api";

interface RequestFilterState {
  status: string;
  start_date: string;
  end_date: string;
  creator:string;
}

const initialState: RequestFilterState = {
  status: "",
  start_date: "",
  end_date: "",
  creator: "",
};
export const fetchRequestsList = createAsyncThunk(
  'request/fetchList',
  async (filters?: { start_date?: string; end_date?: string; status?: string }) => {
    const response = await api.solarpanelRequests.solarpanelRequestsList(filters);
    return response.data;
  }
);
const requestFilterSlice = createSlice({
  name: "requestFilter",
  initialState,
  reducers: {
    setStatus(state, action: PayloadAction<string>) {
      state.status = action.payload;
    },
    setStartDate(state, action: PayloadAction<string>) {
      state.start_date = action.payload;
    },
    setEndDate(state, action: PayloadAction<string>) {
      state.end_date = action.payload;
    },
     setCreator: (state, action: PayloadAction<string>) => {
      state.creator = action.payload;
    },
    resetRequestFilter(state) {
      state.status = "";
      state.start_date = "";
      state.end_date = "";
      state.creator = '';
    }
  }
});

export const { setStatus, setStartDate, setEndDate, setCreator, resetRequestFilter } = requestFilterSlice.actions;
export default requestFilterSlice.reducer;
