import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../api";

interface SolarPanelRequestFilterState {
  status: string;
  start_date: string;
  end_date: string;
  creator: string;
}

const initialState: SolarPanelRequestFilterState = {
  status: "",
  start_date: "",
  end_date: "",
  creator: "",
};

export const fetchSolarPanelRequestsList = createAsyncThunk(
  'solarPanelRequest/fetchList',
  async (filters?: { start_date?: string; end_date?: string; status?: string }) => {
    const response = await api.solarpanelRequests.solarpanelRequestsList(filters);
    return response.data;
  }
);

const solarPanelRequestFilterSlice = createSlice({
  name: "solarPanelRequestFilter",
  initialState,
  reducers: {
    setSolarPanelRequestStatus(state, action: PayloadAction<string>) {
      state.status = action.payload;
    },
    setSolarPanelRequestStartDate(state, action: PayloadAction<string>) {
      state.start_date = action.payload;
    },
    setSolarPanelRequestEndDate(state, action: PayloadAction<string>) {
      state.end_date = action.payload;
    },
    setSolarPanelRequestCreator: (state, action: PayloadAction<string>) => {
      state.creator = action.payload;
    },
    resetSolarPanelRequestFilter(state) {
      state.status = "";
      state.start_date = "";
      state.end_date = "";
      state.creator = '';
    }
  }
});

export const { 
  setSolarPanelRequestStatus, 
  setSolarPanelRequestStartDate, 
  setSolarPanelRequestEndDate, 
  setSolarPanelRequestCreator, 
  resetSolarPanelRequestFilter 
} = solarPanelRequestFilterSlice.actions;

export default solarPanelRequestFilterSlice.reducer;
