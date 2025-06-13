import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    companyName: 'Company',
    jobTitle: 'Job Title',
    jobLink: 'Job Link',
    personName: 'Person Name',
};

export const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        setCompanyName: (state, action) => {
            state.companyName = action.payload;
        },
        setJobTitle: (state, action) => {
            state.jobTitle = action.payload;
        },
        setJobLink: (state, action) => {
            state.jobLink = action.payload;
        },
        setPersonName: (state, action) => {
            state.personName = action.payload;
        },
    },
});

export const { setCompanyName, setJobTitle, setJobLink, setPersonName } = companySlice.actions;
export default companySlice.reducer; 