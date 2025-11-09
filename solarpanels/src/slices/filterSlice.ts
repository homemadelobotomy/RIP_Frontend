import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  start_value: string;
  end_value: string;
}

const initialState: FilterState = {
  start_value: "",
  end_value: "",
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setStartValue(state, action: PayloadAction<string>) {
      state.start_value = action.payload;
    },
    setEndValue(state, action: PayloadAction<string>) {
      state.end_value = action.payload;
    },
    resetFilter(state) {
      state.start_value = "";
      state.end_value = "";
    }
  }
});

export const { setStartValue, setEndValue, resetFilter } = filterSlice.actions;
export default filterSlice.reducer;
