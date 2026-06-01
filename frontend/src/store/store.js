import { configureStore } from '@reduxjs/toolkit';
import variablesReducer from './variablesSlice';
import layoutReducer from './layoutSlice';

export const store = configureStore({
    reducer: {
        variables: variablesReducer,
        layout: layoutReducer,
    },
});
