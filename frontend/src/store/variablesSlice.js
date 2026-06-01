import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BaseURL } from '../utils/BaseURL';

// Curated palette offered by the color picker (and used by seeded defaults)
export const COLOR_PALETTE = [
  '#22c55e', // green
  '#3b82f6', // blue
  '#ec4899', // pink
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#14b8a6', // teal
  '#ef4444', // red
  '#64748b', // slate
];

export const fetchVariables = createAsyncThunk(
  'variables/fetchVariables',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BaseURL}/variables`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addVariable = createAsyncThunk(
  'variables/addVariable',
  async ({ key, color }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BaseURL}/variables`, { key, color });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateVariable = createAsyncThunk(
  'variables/updateVariable',
  async ({ id, value, key, color }, { rejectWithValue }) => {
    try {
      const body = {};
      if (value !== undefined) body.value = value;
      if (key !== undefined) body.key = key;
      if (color !== undefined) body.color = color;
      const response = await axios.put(`${BaseURL}/variables/${id}`, body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteVariable = createAsyncThunk(
  'variables/deleteVariable',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BaseURL}/variables/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  variables: [], // [{ _id, key, value, color, order }]
  loading: false,
  error: null,
};

const upsert = (state, variable) => {
  const index = state.variables.findIndex((v) => v._id === variable._id);
  if (index !== -1) {
    state.variables[index] = variable;
  } else {
    state.variables.push(variable);
  }
};

const variablesSlice = createSlice({
  name: 'variables',
  initialState,
  reducers: {
    // Instant local update while typing; the API call is debounced in the component
    updateLocalVariableValue: (state, action) => {
      const { id, value } = action.payload;
      const existing = state.variables.find((v) => v._id === id);
      if (existing) existing.value = value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVariables.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVariables.fulfilled, (state, action) => {
        state.loading = false;
        state.variables = action.payload;
      })
      .addCase(fetchVariables.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addVariable.fulfilled, (state, action) => {
        state.variables.push(action.payload);
      })
      .addCase(addVariable.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateVariable.fulfilled, (state, action) => {
        upsert(state, action.payload);
      })
      .addCase(updateVariable.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteVariable.fulfilled, (state, action) => {
        state.variables = state.variables.filter((v) => v._id !== action.payload);
      })
      .addCase(deleteVariable.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { updateLocalVariableValue } = variablesSlice.actions;
export default variablesSlice.reducer;
