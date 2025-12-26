import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface SolarPanelFilterState {
  start_value: number | null;
  end_value: number | null;
}

const initialState: SolarPanelFilterState = {
  start_value: null,
  end_value: null,
};

const solarPanelFilterSlice = createSlice({
  name: "solarPanelFilter",
  initialState,
  reducers: {
    setSolarPanelStartValue(state, action: PayloadAction<number | null>) {
      state.start_value = action.payload;
    },
    setSolarPanelEndValue(state, action: PayloadAction<number | null>) {
      state.end_value = action.payload;
    },
    resetSolarPanelFilter(state) {
      state.start_value = null;
      state.end_value = null;
    }
  }
});

export const { setSolarPanelStartValue, setSolarPanelEndValue, 
  resetSolarPanelFilter } = solarPanelFilterSlice.actions;
export default solarPanelFilterSlice.reducer;
