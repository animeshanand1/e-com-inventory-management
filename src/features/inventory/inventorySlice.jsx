import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  addItemAPI, 
  updateItemAPI, 
  deleteItemAPI, 
  fetchInventoryAPI 
} from '../../api/inventoryApi';

const initialState = {
  items: [],
  status: 'idle', 
  error: null,
  addUpdateStatus: 'idle',
  pagination: {
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10
  }
};

export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory', 
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await fetchInventoryAPI(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addNewItem = createAsyncThunk(
  'inventory/addNewItem', 
  async (newItem, { rejectWithValue }) => {
    try {
      const response = await addItemAPI(newItem);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateItem = createAsyncThunk(
  'inventory/updateItem', 
  async (itemToUpdate, { rejectWithValue }) => {
    try {
      const response = await updateItemAPI(itemToUpdate);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteItem = createAsyncThunk(
  'inventory/deleteItem', 
  async (itemId, { rejectWithValue }) => {
    try {
      await deleteItemAPI(itemId);
      return itemId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAddUpdateStatus: (state) => {
      state.addUpdateStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
    
      .addCase(fetchInventory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.products || action.payload.items || action.payload;
       
        if (action.payload.totalItems !== undefined) {
          state.pagination = {
            totalItems: action.payload.totalItems,
            totalPages: action.payload.totalPages,
            currentPage: action.payload.currentPage,
            limit: action.payload.limit || 10
          };
        }
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
   
      .addCase(addNewItem.pending, (state) => {
        state.addUpdateStatus = 'loading';
        state.error = null;
      })
      .addCase(addNewItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.addUpdateStatus = 'succeeded';
      })
      .addCase(addNewItem.rejected, (state, action) => {
        state.addUpdateStatus = 'failed';
        state.error = action.payload;
      })
    
      .addCase(updateItem.pending, (state) => {
        state.addUpdateStatus = 'loading';
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.addUpdateStatus = 'succeeded';
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.addUpdateStatus = 'failed';
        state.error = action.payload;
      })
      
      .addCase(deleteItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        state.status = 'succeeded';
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearError, clearAddUpdateStatus } = inventorySlice.actions;

// Selectors
export const selectAllItems = (state) => state.inventory.items;
export const selectTotalItems = (state) => state.inventory.pagination.totalItems || state.inventory.items.length;
export const selectLowStockItems = (state) =>
  state.inventory.items.filter(item => item.quantity <= 10).length; 
export const selectTotalInventoryValue = (state) =>
  state.inventory.items.reduce((total, item) => total + (item.price * item.quantity), 0);
export const selectCategoriesCount = (state) => {
  const categories = state.inventory.items.map(item => item.category);
  return new Set(categories).size;
};
export const selectInventoryStatus = (state) => state.inventory.status;
export const selectInventoryError = (state) => state.inventory.error;
export const selectAddUpdateStatus = (state) => state.inventory.addUpdateStatus;
export const selectPagination = (state) => state.inventory.pagination;

export default inventorySlice.reducer;