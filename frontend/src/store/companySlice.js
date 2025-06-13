import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    companyName: '',
};

export const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        setCompanyName: (state, action) => {
            state.companyName = action.payload;
        },
    },
});

export const { setCompanyName } = companySlice.actions;
export default companySlice.reducer; 