import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '@/utils/axios';
//
import { dispatch } from '../store';
import { getDaysInMonth, getMonth, getYear } from 'date-fns';

// ----------------------------------------------------------------------

const initialState = {
	isLoading: false,
	error: null,
	toolboxTalks: null,
	tbtByYear: null,
	positions: null,
	tbtYearTotalByPosition: null,
	totalTbtByYear: null
};

const slice = createSlice({
	name: 'toolboxtalk',
	initialState,
	reducers: {
		// START LOADING
		startLoading (state) {
			state.isLoading = true;
		},

		// STOP LOADING
		stopLoading (state) {
			state.isLoading = false;
		},

		// HAS ERROR
		hasError (state, action) {
			state.isLoading = false;
			state.error = action.payload;
		},

		addToolboxTalk (state, action) {
			state.toolboxTalks.append(action.payload)
		},

		updateToolboxTalk (state, action) {
			const tbtIdx = state.toolboxTalks.findIndex(tbt => tbt.tbt_id === action.payload.tbt_id);
			if (tbtIdx !== -1) {
				state.toolboxTalks[tbtIdx] = action.payload;
			}
		},

		deleteToolboxTalk (state, action) {
			const tbtIdx = state.toolboxTalks.findIndex(tbt => tbt.tbt_id === action.payload.tbt_id);
			if (tbtIdx !== -1) {
				state.toolboxTalks.splice(tbtIdx, 1);
			}
		},

		setToolboxTalk (state, action) {
			state.toolboxTalks = action.payload;
		},

		setTbtByYear (state, action) {
			state.tbtByYear = action.payload;
			state.isLoading = false;
		},

		setTbtYearTotalByPosition (state, action) {
			state.tbtYearTotalByPosition = action.payload;
		},

		setTotalMpMhByYear (state, action) {
			state.totalTbtByYear = action.payload;
		}
	},
});

// Reducer
export default slice.reducer;

// Actions
export const { startLoading, stopLoading, setToolboxTalk, setTbtByYear } = slice.actions;

// ----------------------------------------------------------------------

export function getTbts () {
	return async () => {
		dispatch(slice.actions.startLoading());
		try {
			const { data: { tbt, positions } } = await axios.get('/api/toolbox-talks');
			convertTbtByYear({ tbt, positions });
			dispatch(slice.actions.setToolboxTalk(tbt));
		} catch (error) {
			dispatch(slice.actions.hasError(error));
		}
	};
}

export function convertTbtByYear ({ tbt = [], positions = [] }) {
	dispatch(slice.actions.startLoading());
	const tbtByDate = tbt.reduce((acc, toolbox) => {
		const dateConducted = new Date(toolbox.date_conducted);
		const year = getYear(dateConducted);
		const month = getMonth(dateConducted) + 1; // getMonth is zero index add 1 to match the object
		const day = dateConducted.getDate();

		const MONTHS = {
			1: [...Array(getDaysInMonth(new Date(year, 0, 1))).keys()].reduce((acc, x) => {
				acc[x + 1] = null;
				return acc;
			}, {}), // Jan,
			2: [...Array(getDaysInMonth(new Date(year, 1, 1))).keys()].reduce((acc, x) => {
				acc[x + 1] = null;
				return acc;
			}, {}), // Feb,
			3: [...Array(getDaysInMonth(new Date(year, 2, 1))).keys()].reduce((acc, x) => {
				acc[x + 1] = null;
				return acc;
			}, {}), // Mar,
			4: [...Array(getDaysInMonth(new Date(year, 3, 1))).keys()].reduce((acc, x) => {
				acc[x + 1] = null;
				return acc;
			}, {}), // Apr,
			5: [...Array(getDaysInMonth(new Date(year, 4, 1))).keys()].reduce((acc, x) => {
				acc[x + 1] = null;
				return acc;
			}, {}), // May,
			6: [...Array(getDaysInMonth(new Date(year, 5, 1))).keys()].reduce((acc, x) => {
				acc[x + 1] = null;
				return acc;
			}, {}), // June,
			7: [...Array(getDaysInMonth(new Date(year, 6, 1))).keys()].reduce((acc, x) => {
				acc[x + 1] = null;
				return acc;
			}, {}), // July,
			8: [...Array(getDaysInMonth(new Date(year, 7, 1))).keys()].reduce((acc, x) => {
				acc[x + 1] = null;
				return acc;
			}, {}), // Aug,
			9: [...Array(getDaysInMonth(new Date(year, 8, 1))).keys()].reduce((acc, x) => {
				acc[x + 1] = null;
				return acc;
			}, {}), // Sept,
			10: [...Array(getDaysInMonth(new Date(year, 9, 1))).keys()].reduce((acc, x) => {
				acc[x + 1] = null;
				return acc;
			}, {}), // Oct,
			11: [...Array(getDaysInMonth(new Date(year, 10, 1))).keys()].reduce((acc, x) => {
				acc[x + 1] = null;
				return acc;
			}, {}), // Nov,
			12: [...Array(getDaysInMonth(new Date(year, 11, 1))).keys()].reduce((acc, x) => {
				acc[x + 1] = null;
				return acc;
			}, {}), // Dec,
		}

		if (year in acc) {
			if (acc[year][month][day] !== null) {
				acc[year][month][day].manpower += toolbox.participants.length;
				acc[year][month][day].positions = getPositionParticipant(positions, toolbox.participants, acc[year][month][day].positions);
				acc[year][month][day].tbt.push(toolbox);
			} else {
				acc[year][month][day] = {
					manpower: toolbox.participants.length,
					positions: getPositionParticipant(positions, toolbox.participants),
					tbt: [toolbox]
				};
			}
		} else {
			acc[year] = MONTHS;

			acc[year][month][day] = {
				manpower: toolbox.participants.length,
				positions: getPositionParticipant(positions, toolbox.participants),
				tbt: [toolbox]
			};
		}
		return acc;
	}, {});
	calculateMhMpByPosition(tbtByDate);
	dispatch(slice.actions.setTbtByYear(tbtByDate));
}

function getPositionParticipant (positions, participants = [], defaultValue = {}) {
	return participants.reduce((participantObj, currParticipant) => {
		const pos = positions.find(pos => pos.position_id === currParticipant.position);
		const position = pos.position.trim();
		if (position in participantObj) {
			participantObj[position] += 1;
		} else {
			participantObj[position] = 1;
		}
		return participantObj;
	}, defaultValue);
}

function calculateMhMpByPosition (tbtByDate) {
	const tbtYearKeysArr = Object.keys(tbtByDate);
	const byPos = tbtYearKeysArr.reduce((acc, curr) => {
		const months = Object.entries(tbtByDate[curr]).reduce((monthsObj, currMonth) => {
			const monthArr = Object.values(currMonth[1]).filter(v => v);
			monthsObj[currMonth[0]] = monthArr.reduce((dayObj, currDay) => {
				Object.entries(currDay.positions).forEach(tupple => {
					if (tupple[0] in dayObj) {
						dayObj[tupple[0]].mp += tupple[1];
						dayObj[tupple[0]].mh += (tupple[1] * 9);
					} else {
						dayObj[tupple[0]] = {
							mp: tupple[1],
							mh: tupple[1] * 9
						};
					}
				});
				return dayObj;
			}, {});
			return monthsObj;
		}, {});
		acc[curr] = months;
		return acc;
	}, {});
	const totalMpMhByYear = tbtYearKeysArr.reduce((acc, curr) => {
		const months = Object.entries(tbtByDate[curr]).reduce((monthsObj, currMonth) => {
			const monthArr = Object.values(currMonth[1]).filter(v => v);

			const mpMh = monthArr.reduce((dayObj, currDay) => {
				dayObj.totalManpower += currDay.manpower;
				dayObj.totalManhours += currDay.manpower * 9;
				return dayObj;
			}, { totalManpower: 0, totalManhours: 0 });

			let safeManhours = mpMh.totalManhours;
			const prevMonth = monthsObj[currMonth[0] - 1];

			if (prevMonth?.safeManhours === safeManhours) {
				safeManhours += prevMonth.safeManhours;
			}

			monthsObj[currMonth[0]] = {
				...mpMh,
				totalManpowerAveDaysWork: Math.ceil(mpMh.totalManpower / monthArr.length),
				totalManpowerAveDay: Math.ceil(mpMh.totalManpower / Object.values(currMonth[1]).length),
				safeManhours,
				daysWork: monthArr.length,
				daysWoWork: Object.values(currMonth[1]).length - monthArr.length
			}
			return monthsObj;
		}, {});
		acc[curr] = months;
		return acc;
	}, {});
	dispatch(slice.actions.setTotalMpMhByYear(totalMpMhByYear));
	dispatch(slice.actions.setTbtYearTotalByPosition(byPos));
}
