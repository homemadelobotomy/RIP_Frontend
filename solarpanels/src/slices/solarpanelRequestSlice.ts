import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';
import { logoutUser } from './authSlice'
import type {
  LabInternalAppDTOOneSolarPanelRequestResponse,
  LabInternalAppDTOSolarPanelsRequestsResponse
} from '../api/Api';

interface SolarPanelRequestState {
  currentRequest: LabInternalAppDTOOneSolarPanelRequestResponse | null;
  requestsList: LabInternalAppDTOSolarPanelsRequestsResponse[];
  requestInfo: { request_id?: number; panels_in_request?: number };
  loading: boolean;
  isDraft: boolean;
  error: string | null;
}

const initialState: SolarPanelRequestState = {
  currentRequest: null,
  requestsList: [],
  requestInfo: {},
  loading: false,
  isDraft: false,
  error: null,
};

export const fetchSolarPanelRequestInfo = createAsyncThunk(
  'solarPanelRequest/fetchInfo',
  async () => {
    const response = await api.solarpanelRequests.infoList();
    return response.data;
  }
);

export const fetchCurrentSolarPanelRequest = createAsyncThunk(
  'solarPanelRequest/fetchCurrent',
  async (id: number) => {
    const response = await api.solarpanelRequests.solarpanelRequestsDetail(id);
    return response.data;
  }
);

export const fetchSolarPanelRequestsList = createAsyncThunk(
  'solarPanelRequest/fetchList',
  async (filters?: { start_date?: string; end_date?: string; status?: string }) => {
    const response = await api.solarpanelRequests.solarpanelRequestsList(filters);
    return response.data;
  }
);

export const addSolarPanelToRequest = createAsyncThunk(
  'solarPanelRequest/addPanel',
  async (panelId: number) => {
    await api.panels.addPanelToRequest(panelId);
  }
);

export const removeSolarPanelFromRequest = createAsyncThunk(
  'solarPanelRequest/removePanel',
  async ({ requestId, panelId }: { requestId: number; panelId: number }) => {
    await api.solarpanelRequests.deleteSolarPanelFromRequest(requestId, panelId);
  }
);

export const updateSolarPanelArea = createAsyncThunk(
  'solarPanelRequest/updateArea',
  async ({ requestId, panelId, area }: { requestId: number; panelId: number; area: number }, { rejectWithValue }) => {
    try {
      const response = await api.solarpanelRequests.changeSolarpanelArea(requestId, panelId, { area });
      return response.data;
    } catch (error: any) {
      const message = error?.response?.status == 400 ? "Заполните поле площади корректно" : "Ошибка сохранения :(";
      return rejectWithValue(message);
    }
  }
);

export const updateSolarPanelInsolation = createAsyncThunk(
  'solarPanelRequest/updateInsolation',
  async ({ requestId, insolation }: { requestId: number; insolation: number }, { rejectWithValue }) => {
    try {
      const response = await api.solarpanelRequests.solarpanelRequestsUpdate(requestId, { insolation });
      return response.data;
    } catch (error: any) {
      const message = error?.response?.status == 400 ? "Заполните поле инсоляции корректно" : "Ошибка сохранения :(";
      return rejectWithValue(message);
    }
  }
);

export const moderateSolarPanelRequest = createAsyncThunk(
  'solarPanelRequest/moderate',
  async ({ requestId, action }: { requestId: number; action: string }, { rejectWithValue }) => {
    try {
      const response = await api.solarpanelRequests.moderateUpdate(requestId, { action });
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Ошибка модерации";
      return rejectWithValue(message);
    }
  }
);

export const formateSolarPanelRequest = createAsyncThunk(
  'solarPanelRequest/formate',
  async (requestId: number, { rejectWithValue }) => {
    try {
      const response = await api.solarpanelRequests.formateUpdate(requestId);
      return response.data;
    } catch (error: any) {
      const message = error?.response?.status == 400 ? "Заполните все поля и сохраните изменения" : "Ошибка формирования :(";
      return rejectWithValue(message);
    }
  }
);

export const deleteSolarPanelRequest = createAsyncThunk(
  'solarPanelRequest/delete',
  async (requestId: number) => {
    await api.solarpanelRequests.solarpanelRequestsDelete(requestId);
  }
);

const solarPanelRequestSlice = createSlice({
  name: 'solarPanelRequest',
  initialState,
  reducers: {
    clearCurrentSolarPanelRequest: (state) => {
      state.currentRequest = null;
      state.error = null;
    },
    clearSolarPanelRequestError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSolarPanelRequestInfo.fulfilled, (state, action) => {
        state.requestInfo = action.payload;
      })
      .addCase(fetchCurrentSolarPanelRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentSolarPanelRequest.fulfilled, (state, action) => {
        state.currentRequest = action.payload;
        state.loading = false;
        state.isDraft = action.payload.status === 'черновик';
      })
      .addCase(fetchCurrentSolarPanelRequest.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchSolarPanelRequestsList.fulfilled, (state, action) => {
        state.requestsList = action.payload;
      })
      .addCase(deleteSolarPanelRequest.fulfilled, (state) => {
        state.currentRequest = null;
        state.requestInfo = {};
      })
      .addCase(updateSolarPanelInsolation.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateSolarPanelArea.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(formateSolarPanelRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(moderateSolarPanelRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentRequest = null;
        state.requestsList = [];
        state.requestInfo = {};
        state.isDraft = false;
        state.error = null;
      });
  },
});

export const { clearCurrentSolarPanelRequest, clearSolarPanelRequestError } = solarPanelRequestSlice.actions;
export default solarPanelRequestSlice.reducer;
