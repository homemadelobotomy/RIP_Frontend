import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';


export const MOCK_PANELS: SolarPanel[] = [
  {
    ID: 1,
    Title: "Монокристаллическая панель",
    Type: "Монокристаллическая",
    Description: "Высокоэффективная панель из монокристаллов.",
    Power: 300,
    Height: 1640,
    Width: 992,
    Depth: 35,
    Efficiency: "20-22",
    Image: "default.png",
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
    Image: "default.png",
    IsDelete: false,
  },
  {
    ID: 3,
    Title: "Тонкопленочная панель",
    Type: "Тонкопленочная",
    Description: "Гибкая и легкая панель для сложных поверхностей.",
    Power: 150,
    Height: 1200,
    Width: 600,
    Depth: 10,
    Efficiency: "15-17",
    Image: "default.png",
    IsDelete: false,
  },
];

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
  embedding?: number[];
}

interface DataState {
  solarPanels: SolarPanel[];
  currentPanel: SolarPanel | null;
  loading: boolean;
  error: string | null;
}

const initialState: DataState = {
  solarPanels: [],
  currentPanel: null,
  loading: false,
  error: null,
};

export const fetchSolarPanels = createAsyncThunk(
  'data/fetchPanels',
  async (
    filters: { start_value?: number|null; end_value?: number|null } = {}, 
  ) => {
    try {
      const response = await api.panels.panelsList(filters);
      return response.data;
    } catch (error: any) {
            
      let filtered = MOCK_PANELS;
      if (filters.start_value || filters.end_value) {
        const min = filters.start_value ? filters.start_value : 0;
        const max = filters.end_value ? filters.end_value : Infinity;
        filtered = MOCK_PANELS.filter((p) => p.Power >= min && p.Power <= max);
      }
      
      return filtered;
    }
  }
);

export const fetchPanelById = createAsyncThunk(
  'data/fetchPanelById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.panels.panelsDetail(id);
      return response.data;
    } catch (error: any) {
      const panel = MOCK_PANELS.find((p) => p.ID === id);
      if (!panel) {
        return rejectWithValue("Панель не найдена");
      }
      return panel;
    }
  }
);


const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    clearCurrentPanel: (state) => {
      state.currentPanel = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSolarPanels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSolarPanels.fulfilled, (state, action) => {
        state.solarPanels = action.payload as SolarPanel[];
        state.loading = false;
      })
      .addCase(fetchSolarPanels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(fetchPanelById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPanelById.fulfilled, (state, action) => {
        state.currentPanel = action.payload as SolarPanel;
        state.loading = false;
      })
      .addCase(fetchPanelById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export const { clearCurrentPanel, clearError } = dataSlice.actions;
export default dataSlice.reducer;
