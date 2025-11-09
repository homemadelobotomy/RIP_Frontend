// src/store/slices/dataSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface SolarPanel {
  ID: number;
  Title: string;
  Type: string;
  Description: string;
  Power: number;
  Height: number;
  Width: number;
  Depth: number;
  Efficiency: string;
  Image: string;
  IsDelete: boolean;
}

export interface DataState {
  SolarPanels: SolarPanel[];
  solarPanelsInRequest: number;
}

// Моковые данные (fallback)
export const MOCK_PANELS: SolarPanel[] = [
  {
    ID: 1,
    Title: "Монокристаллическая панель",
    Type: "Монокристаллическая",
    Description: "Высокоэффективная панель из монокристаллов.",
    Power: 50,
    Height: 1640,
    Width: 992,
    Depth: 35,
    Efficiency: "20-22",
    Image: "",
    IsDelete: false,
  },
  {
    ID: 2,
    Title: "Поликристаллическая панель",
    Type: "Поликристаллическая",
    Description: "Надежная панель с хорошим соотношением цена/качество.",
    Power: 280,
    Height: 1650,
    Width: 998,
    Depth: 35,
    Efficiency: "18-20",
    Image: "",
    IsDelete: false,
  },
];

const initialState: DataState = {
  SolarPanels: MOCK_PANELS, 
  solarPanelsInRequest: 0,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setSolarPanels(state, action: PayloadAction<SolarPanel[]>) {
      state.SolarPanels = action.payload;
    },
    setSolarPanelsInRequest(state, action: PayloadAction<number>) {
      state.solarPanelsInRequest = action.payload;
    },
    incrementSolarPanelsInRequest(state) {
      state.solarPanelsInRequest++;
    },
    resetSolarPanelsInRequest(state) {
      state.solarPanelsInRequest = 0;
    },
  },
});

export const {
  setSolarPanels,
  setSolarPanelsInRequest,
  incrementSolarPanelsInRequest,
  resetSolarPanelsInRequest,
} = dataSlice.actions;

export default dataSlice.reducer;
