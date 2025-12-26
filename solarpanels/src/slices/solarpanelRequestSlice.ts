import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';
import { logoutUser } from './authSlice'
import type { 
  LabInternalAppDTOOneSolarPanelRequestResponse,
  LabInternalAppDTOSolarPanelsRequestsResponse 
} from '../api/Api';

interface RequestState {
  currentRequest: LabInternalAppDTOOneSolarPanelRequestResponse | null;
  requestsList: LabInternalAppDTOSolarPanelsRequestsResponse[];
  requestInfo: { request_id?: number; panels_in_request?: number };
  loading: boolean;
  isDraft: boolean;
  error: string | null;
}

const initialState: RequestState = {
  currentRequest: null,
  requestsList: [],
  requestInfo: {},
  loading: false,
  isDraft: false,
  error: null,
};

export const fetchRequestInfo = createAsyncThunk(
  'request/fetchInfo',
  async () => {
    const response = await api.solarpanelRequests.infoList();
    return response.data;
  }
);

export const fetchCurrentRequest = createAsyncThunk(
  'request/fetchCurrent',
  async (id: number) => {
    const response = await api.solarpanelRequests.solarpanelRequestsDetail(id);
    return response.data;
  }
);

export const fetchRequestsList = createAsyncThunk(
  'request/fetchList',
  async (filters?: { start_date?: string; end_date?: string; status?: string }) => {
    const response = await api.solarpanelRequests.solarpanelRequestsList(filters);
    return response.data;
  }
);

export const addPanelToRequest = createAsyncThunk(
  'request/addPanel',
  async (panelId: number) => {
    await api.panels.addPanelToRequest(panelId);
  }
);

export const removePanelFromRequest = createAsyncThunk(
  'request/removePanel',
  async ({ requestId, panelId }: { requestId: number; panelId: number }) => {
    await api.solarpanelRequests.deleteSolarPanelFromRequest(requestId, panelId);
  }
);

export const updatePanelArea = createAsyncThunk(
  'request/updateArea',
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

export const updateInsolation = createAsyncThunk(
  'request/updateInsolation',
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

export const moderateRequest = createAsyncThunk(
  'request/moderate',
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

export const formateRequest = createAsyncThunk(
  'request/formate',
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

export const deleteRequest = createAsyncThunk(
  'request/delete',
  async (requestId: number) => {
    await api.solarpanelRequests.solarpanelRequestsDelete(requestId);
  }
);

const requestSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    clearCurrentRequest: (state) => {
      state.currentRequest = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequestInfo.fulfilled, (state, action) => {
        state.requestInfo = action.payload;
      })
      .addCase(fetchCurrentRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentRequest.fulfilled, (state, action) => {
        state.currentRequest = action.payload;
        state.loading = false;
        state.isDraft = action.payload.status === 'черновик';
      })
      .addCase(fetchCurrentRequest.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchRequestsList.fulfilled, (state, action) => {
        state.requestsList = action.payload;
      })
      .addCase(deleteRequest.fulfilled, (state) => {
        state.currentRequest = null;
        state.requestInfo = {};
      })
      .addCase(updateInsolation.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updatePanelArea.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(formateRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(moderateRequest.rejected, (state, action) => {
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

export const { clearCurrentRequest, clearError } = requestSlice.actions;
export default requestSlice.reducer;
