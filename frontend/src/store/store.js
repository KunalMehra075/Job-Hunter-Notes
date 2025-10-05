import { configureStore } from '@reduxjs/toolkit';
import companyReducer from './companySlice';
import layoutReducer from './layoutSlice';

export const store = configureStore({
    reducer: {
        company: companyReducer,
        layout: layoutReducer,
    },
});