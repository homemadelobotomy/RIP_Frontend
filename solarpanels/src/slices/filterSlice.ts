import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  start_value: number | null;
  end_value: number | null;
}

const initialState: FilterState = {
  start_value: null,
  end_value: null,
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setStartValue(state, action: PayloadAction<number|null>) {
      state.start_value = action.payload;
    },
    setEndValue(state, action: PayloadAction<number|null>) {
      state.end_value = action.payload;
    },
    resetFilter(state) {
      state.start_value = null;
      state.end_value = null;
    }
  }
});

export const { setStartValue, setEndValue, resetFilter } = filterSlice.actions;
export default filterSlice.reducer;
