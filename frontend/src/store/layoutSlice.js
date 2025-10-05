import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BaseURL } from '../utils/BaseURL';

// Async thunks for API calls
export const fetchLayouts = createAsyncThunk(
  'layout/fetchLayouts',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BaseURL}/layouts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const saveLayout = createAsyncThunk(
  'layout/saveLayout',
  async (layoutData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BaseURL}/layouts`, layoutData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateLayout = createAsyncThunk(
  'layout/updateLayout',
  async ({ id, layoutData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${BaseURL}/layouts/${id}`, layoutData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteLayout = createAsyncThunk(
  'layout/deleteLayout',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BaseURL}/layouts/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const batchUpdateLayouts = createAsyncThunk(
  'layout/batchUpdateLayouts',
  async (layouts, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${BaseURL}/layouts/batch`, { layouts }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const resetLayouts = createAsyncThunk(
  'layout/resetLayouts',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BaseURL}/layouts/reset`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fixLayoutConstraints = createAsyncThunk(
  'layout/fixLayoutConstraints',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BaseURL}/layouts/fix-constraints`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  layouts: [], // Array of layout objects: { id, noteId, x, y, width, height }
  loading: false,
  error: null,
  lastSaved: null,
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    // Local state updates (before API calls)
    updateLocalLayout: (state, action) => {
      const { noteId, x, y, width, height } = action.payload;
      const existingLayout = state.layouts.find(layout => layout.noteId === noteId);

      if (existingLayout) {
        existingLayout.x = x;
        existingLayout.y = y;
        existingLayout.width = width;
        existingLayout.height = height;
      } else {
        state.layouts.push({
          id: `temp-${Date.now()}`, // Temporary ID until saved to backend
          noteId,
          x,
          y,
          width,
          height,
        });
      }
    },

    updateLocalLayouts: (state, action) => {
      const layoutUpdates = action.payload;
      layoutUpdates.forEach(update => {
        const { noteId, x, y, width, height } = update;
        const existingLayout = state.layouts.find(layout => layout.noteId === noteId);

        if (existingLayout) {
          existingLayout.x = x;
          existingLayout.y = y;
          existingLayout.width = width;
          existingLayout.height = height;
        } else {
          state.layouts.push({
            id: `temp-${Date.now()}-${noteId}`,
            noteId,
            x,
            y,
            width,
            height,
          });
        }
      });
    },

    removeLocalLayout: (state, action) => {
      const noteId = action.payload;
      state.layouts = state.layouts.filter(layout => layout.noteId !== noteId);
    },

    clearLayouts: (state) => {
      state.layouts = [];
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch layouts
      .addCase(fetchLayouts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLayouts.fulfilled, (state, action) => {
        state.loading = false;
        state.layouts = action.payload;
      })
      .addCase(fetchLayouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Save layout
      .addCase(saveLayout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveLayout.fulfilled, (state, action) => {
        state.loading = false;
        const newLayout = action.payload;
        const existingIndex = state.layouts.findIndex(layout => layout.noteId === newLayout.noteId);

        if (existingIndex !== -1) {
          state.layouts[existingIndex] = newLayout;
        } else {
          state.layouts.push(newLayout);
        }
        state.lastSaved = new Date().toISOString();
      })
      .addCase(saveLayout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update layout
      .addCase(updateLayout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLayout.fulfilled, (state, action) => {
        state.loading = false;
        const updatedLayout = action.payload;
        const index = state.layouts.findIndex(layout => layout.id === updatedLayout.id);

        if (index !== -1) {
          state.layouts[index] = updatedLayout;
        }
        state.lastSaved = new Date().toISOString();
      })
      .addCase(updateLayout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete layout
      .addCase(deleteLayout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLayout.fulfilled, (state, action) => {
        state.loading = false;
        state.layouts = state.layouts.filter(layout => layout.id !== action.payload);
      })
      .addCase(deleteLayout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Batch update layouts
      .addCase(batchUpdateLayouts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(batchUpdateLayouts.fulfilled, (state, action) => {
        state.loading = false;
        state.layouts = action.payload;
        state.lastSaved = new Date().toISOString();
      })
      .addCase(batchUpdateLayouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reset layouts
      .addCase(resetLayouts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetLayouts.fulfilled, (state, action) => {
        state.loading = false;
        state.layouts = action.payload;
        state.lastSaved = new Date().toISOString();
      })
      .addCase(resetLayouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fix layout constraints
      .addCase(fixLayoutConstraints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fixLayoutConstraints.fulfilled, (state, action) => {
        state.loading = false;
        // Update the layouts with the fixed constraints
        if (action.payload.layouts) {
          action.payload.layouts.forEach(fixedLayout => {
            const existingIndex = state.layouts.findIndex(l => l.noteId === fixedLayout.noteId);
            if (existingIndex !== -1) {
              state.layouts[existingIndex] = fixedLayout;
            }
          });
        }
        state.lastSaved = new Date().toISOString();
      })
      .addCase(fixLayoutConstraints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  updateLocalLayout,
  updateLocalLayouts,
  removeLocalLayout,
  clearLayouts,
  clearError,
} = layoutSlice.actions;

export default layoutSlice.reducer;
