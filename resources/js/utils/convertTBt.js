import { getDaysInMonth, getMonth, getYear } from "date-fns";


export function convertTbtByYear ({ tbt = [] }) {
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
				acc[year][month][day].positions = getPositionParticipant(toolbox.participants, acc[year][month][day].positions);
				acc[year][month][day].tbt.push(toolbox);
			} else {
				acc[year][month][day] = {
					manpower: toolbox.participants.length,
					positions: getPositionParticipant(toolbox.participants),
					tbt: [toolbox]
				};
			}
		} else {
			acc[year] = MONTHS;

			acc[year][month][day] = {
				manpower: toolbox.participants.length,
				positions: getPositionParticipant(toolbox.participants),
				tbt: [toolbox]
			};
		}
		return acc;
	}, {});
	return calculateMhMpByPosition(tbtByDate);
}

function getPositionParticipant (participants = [], defaultValue = {}) {
	return participants.reduce((participantObj, currParticipant) => {
		const position = currParticipant?.raw_position?.trim();
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
				currDay?.tbt?.forEach(toolbox => {
					dayObj.location.add(toolbox.location.trim().toLowerCase());
				});
				return dayObj;
			}, { totalManpower: 0, totalManhours: 0, location: new Set() });

			monthsObj[currMonth[0]] = {
				...mpMh,
				totalManpowerAveDay: Math.ceil(mpMh.totalManpower / Object.values(currMonth[1]).length),
				safeManhours: mpMh.totalManhours,
				daysWork: monthArr.length,
				daysWoWork: Object.values(currMonth[1]).length - monthArr.length
			}
			return monthsObj;
		}, {});
		acc[curr] = months;
		return acc;
	}, {});

	return {
		totalTbtByYear: totalMpMhByYear,
		tbtYearTotalByPosition: byPos
	}
}
