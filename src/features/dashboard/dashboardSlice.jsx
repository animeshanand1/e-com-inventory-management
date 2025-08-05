import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboardSummaryAPI } from '../../api/dashboardApi';

const initialState = {
  summary: {
    totalValue: 0,
    lowStockCount: 0,
    totalItems: 0,
    totalQuantity: 0,
    totalRevenue: 0
  },
  status: 'idle',
  error: null,
};

export const fetchDashboardSummary = createAsyncThunk(
  'dashboard/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDashboardSummaryAPI();
      console.log('Dashboard summary fetched:', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        let raw = action.payload;
        if (raw.summary) raw = raw.summary;
        else if (raw.data) raw = raw.data;
       
        state.summary = {
          totalItems: raw.productCount ?? 0,
          lowStockCount: Array.isArray(raw.lowStockProducts) ? raw.lowStockProducts.length : 0,
          totalQuantity: raw.productCount ?? 0, 
          totalValue: raw.salesTotal ?? 0,      
          totalRevenue: raw.salesTotal ?? 0    
        };
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearError } = dashboardSlice.actions;

export const selectDashboardSummary = (state) => state.dashboard.summary;
export const selectDashboardStatus = (state) => state.dashboard.status;
export const selectDashboardError = (state) => state.dashboard.error;

export default dashboardSlice.reducer;