import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '@/utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
	isLoading: false,
	error: null,
	employees: []
};

const slice = createSlice({
	name: 'calendar',
	initialState,
	reducers: {
		// START LOADING
		startLoading (state) {
			state.isLoading = true;
		},

		// HAS ERROR
		hasError (state, action) {
			state.isLoading = false;
			state.error = action.payload;
		},

		// GET CONTACT SSUCCESS
		getEmployeesSuccess (state, action) {
			state.isLoading = false;
			state.employees = action.payload;
		},

		setEmployees (state, action) {
			state.employees = action.payload;
		},

	},
});

// Reducer
export default slice.reducer;

// Actions
export const { setEmployees } = slice.actions;


// ----------------------------------------------------------------------

export function getEmployees () {
	return async () => {
		dispatch(slice.actions.startLoading());
		try {
			const response = await axios.get('/api/employees');
			dispatch(slice.actions.getEmployeesSuccess(response.data.employees));
		} catch (error) {
			console.log({ error });
			dispatch(slice.actions.hasError(error));
		}
	};
}