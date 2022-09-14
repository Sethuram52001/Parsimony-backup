import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

interface FilterState {
  timeSpan: string;
  date: string;
}

const initialState: FilterState = {
  timeSpan: 'Day',
  date: moment().format('YYYY-MM-DD') as string,
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setTimeSpan: (state, action) => {
      state.timeSpan = action.payload;
    },
    setDate: (state, action) => {
      state.date = action.payload;
    },
  },
});

export const filterActions = filterSlice.actions;

export default filterSlice;
