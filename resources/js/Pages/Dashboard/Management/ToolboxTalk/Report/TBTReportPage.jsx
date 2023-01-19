import { useEffect, useState } from 'react';
// mui
import { Box, Card, Container, IconButton, Stack, TextField, Typography } from '@mui/material';
import { StyledGridBox, StyledTableCell, StyledTableHead } from './tbtReportStyle';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// Components
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs/CustomBreadcrumbs';
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import { useSettingsContext } from '@/Components/settings';
import { getDaysInMonth, getMonth, getYear } from 'date-fns';
import Scrollbar from '@/Components/scrollbar';
import Iconify from '@/Components/iconify';
import EmptyContent from '@/Components/empty-content';

const TODAY = new Date;
const CURRENT_YEAR = getYear(TODAY);
const CURRENT_MONTH = getMonth(TODAY) + 2;
const MONTH_NAMES = {
	1: 'January',
	2: 'February',
	3: 'March',
	4: 'April',
	5: 'May',
	6: 'June',
	7: 'July',
	8: 'August',
	9: 'September',
	10: 'October',
	11: 'November',
	12: 'December',
}

const TBTReportPage = ({ positions, tbt }) => {
	const { themeStretch } = useSettingsContext();
	const [yearSelected, setYearSelected] = useState(CURRENT_YEAR);
	const [monthSelected, setMonthSelected] = useState(CURRENT_MONTH);
	const [positionData, setPositionData] = useState({});
	const [loading, setLoading] = useState(true);

	const [data, setData] = useState(null);

	const calculateMhMpByPosition = (month) => {
		const monthArr = Object.values(month).filter(v => v);
		const posData = monthArr.reduce((acc, curr) => {
			Object.entries(curr.positions).forEach(tupple => {
				if (tupple[0] in acc) {
					acc[tupple[0]].mp += tupple[1];
					acc[tupple[0]].mh += (tupple[1] * 9);
				} else {
					acc[tupple[0]] = {
						mp: tupple[1],
						mh: tupple[1] * 9
					};
				}
			});
			return acc;
		}, {});
		setPositionData(posData);
	}

	useEffect(() => {
		const tbtByYear = getTbtByYear({ tbt, positions });
		calculateMhMpByPosition(tbtByYear[yearSelected][monthSelected]);
		setData(tbtByYear);

		setLoading(false);
	}, [tbt]);

	if (loading && !data) {
		return <LoadingScreen />
	}

	const handleYearChange = (e) => {
		setYearSelected(e.target.value);
		calculateMhMpByPosition(data[e.target.value][monthSelected]);
	}

	const handleMonthChange = (e) => {
		setMonthSelected(e.target.value);
		calculateMhMpByPosition(data[yearSelected][e.target.value]);
	}

	const handleNextMonth = () => {
		const m = monthSelected === 12 ? 1 : monthSelected + 1;
		setMonthSelected(m);
		calculateMhMpByPosition(data[yearSelected][m]);
	}

	const handlePrevMonth = () => {
		const m = monthSelected === 1 ? 12 : monthSelected - 1;
		setMonthSelected(m);
		calculateMhMpByPosition(data[yearSelected][m]);
	}

	const days = data[yearSelected][monthSelected];
	const totalMpMh = Object.values(positionData).reduce((acc, curr) => {
		acc.mp += curr.mp;
		acc.mh += curr.mh;
		return acc;
	}, { mp: 0, mh: 0 });

	return (
		<>
			<Container maxWidth={themeStretch ? false : 'xl'}>
				<CustomBreadcrumbs
					heading="Toolbox Talk Report"
					links={[
						{
							name: 'Dashboard',
							href: PATH_DASHBOARD.root,
						},
						{
							name: 'Toolbox Talk',
							href: PATH_DASHBOARD.toolboxTalks.root,
						},
						{
							name: 'Report',
						},
					]}
					action={
						<Stack direction="row" gap={1}>
							<TextField
								select
								fullWidth
								SelectProps={{ native: true }}
								label="Year"
								size="small"
								value={yearSelected}
								onChange={handleYearChange}
							>
								{Object.keys(data).map((yr) => <option value={yr} key={yr}>{yr}</option>)}
							</TextField>
							<TextField
								select
								fullWidth
								SelectProps={{ native: true }}
								label="Months"
								size="small"
								value={monthSelected}
								onChange={handleMonthChange}
								sx={{ minWidth: 130 }}
							>
								{Object.entries(MONTH_NAMES).map((m) => <option value={m[0]} key={m[0]}>{m[1]}</option>)}
							</TextField>
						</Stack>
					}
				/>
				<Card sx={{ p: 2 }}>
					<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
						<Box>
							<IconButton size="large" onClick={handlePrevMonth}>
								<Iconify icon="material-symbols:chevron-left" />
							</IconButton>
						</Box>
						<Box>
							<Typography variant="h6">{MONTH_NAMES[monthSelected]} {yearSelected}</Typography>
						</Box>
						<Box>
							<IconButton size="large" onClick={handleNextMonth}>
								<Iconify icon="material-symbols:chevron-right" />
							</IconButton>
						</Box>
					</Stack>
					{Object.entries(positionData).length === 0 ? (
						<EmptyContent
							title="No Data"
							sx={{
								'& span.MuiBox-root': { height: 160 },
							}}
						/>
					) : (
						<Scrollbar sx={{ py: 1 }}>
							<Stack width={1} minWidth={(theme) => theme.breakpoints.values.lg} borderLeft={1}>
								<StyledGridBox gridTemplateColumns={`repeat(${Object.keys(days).length + 11}, minmax(40px, 1fr))`}>
									<StyledTableHead>#</StyledTableHead>
									<StyledTableHead sx={{ gridColumn: "span 4" }}>
										<Typography variant="subtitle2">Position</Typography>
									</StyledTableHead>
									{Object.keys(days).map((d) => (
										<StyledTableHead key={d}>
											<Typography variant="subtitle2">{d}</Typography>
										</StyledTableHead>
									))}
									<StyledTableHead sx={{ gridColumn: "span 2" }}>
										<Typography variant="subtitle2" textAlign="center">TOTAL <span style={{ display: "block" }}>(MP)</span></Typography>
									</StyledTableHead>
									<StyledTableHead sx={{ gridColumn: "span 2" }}>
										<Typography variant="subtitle2" textAlign="center">TOTAL <span style={{ display: "block" }}>(MH)</span></Typography>
									</StyledTableHead>
								</StyledGridBox>
							</Stack>
							{Object.entries(positionData).map((pos, index) => {
								return (
									<Stack width={1} key={pos[0]} minWidth={(theme) => theme.breakpoints.values.lg} borderLeft={1}>
										<Box display="grid" gridTemplateColumns={`repeat(${Object.keys(days).length + 11}, minmax(40px, 1fr))`}>
											<StyledTableCell sx={{ justifyContent: "center" }}>
												<Typography variant="subtitle2">{index + 1}</Typography>
											</StyledTableCell>
											<StyledTableCell sx={{ gridColumn: "span 4", paddingLeft: "2px" }}>
												<Typography variant="subtitle2" sx={{ fontSize: ".85rem", textTransform: "capitalize" }}>{pos[0]}</Typography>
											</StyledTableCell>
											{Object.entries(days).map(([d, v]) => {
												const val = v === null ? 0 : v?.positions[pos[0]] || 0;
												return (
													<StyledTableCell sx={{ justifyContent: "center", backgroundColor: val === 0 ? "#ebebeb" : "#8db4e2" }} key={d}>
														<Typography variant="subtitle2">{val}</Typography>
													</StyledTableCell>
												)
											})}
											<StyledTableCell sx={{ gridColumn: "span 2" }}>
												<Typography variant="subtitle2" textAlign="center" width={1}>{pos[1].mp}</Typography>
											</StyledTableCell>
											<StyledTableCell sx={{ gridColumn: "span 2" }}>
												<Typography variant="subtitle2" textAlign="center" width={1}>{pos[1].mh}</Typography>
											</StyledTableCell>
										</Box>
									</Stack>
								)
							})}
							<Stack width={1} minWidth={(theme) => theme.breakpoints.values.lg} borderLeft={1}>
								<StyledGridBox gridTemplateColumns={`repeat(${Object.keys(days).length + 11}, minmax(40px, 1fr))`}>
									<StyledTableCell sx={{ gridColumn: "span 5", justifyContent: "right" }}>
										<Typography variant="subtitle2" fontWeight={700} sx={{ paddingRight: "4px" }}>Total Manpower</Typography>
									</StyledTableCell>
									{Object.entries(days).map(([d, v]) => (
										<StyledTableCell sx={{ justifyContent: "center" }} key={d}>
											<Typography variant="subtitle2">{v?.manpower || 0}</Typography>
										</StyledTableCell>
									))}
									<StyledTableCell sx={{ gridColumn: "span 2" }}>
										<Typography variant="subtitle2" textAlign="center" fontWeight={700} width={1}>{totalMpMh.mp}</Typography>
									</StyledTableCell>
									<StyledTableCell sx={{ gridColumn: "span 2" }}>
										<Typography variant="subtitle2" textAlign="center" fontWeight={700} width={1}>{totalMpMh.mh}</Typography>
									</StyledTableCell>
								</StyledGridBox>
								<StyledGridBox gridTemplateColumns={`repeat(${Object.keys(days).length + 11}, minmax(40px, 1fr))`}>
									<StyledTableCell sx={{ gridColumn: "span 5", justifyContent: "right" }}>
										<Typography variant="subtitle2" fontWeight={700} sx={{ paddingRight: "4px" }}>Hours Work</Typography>
									</StyledTableCell>
									{Object.keys(days).map((d) => (
										<StyledTableCell sx={{ justifyContent: "center" }} key={d}><Typography variant="subtitle2">9</Typography></StyledTableCell>
									))}
									<StyledTableCell sx={{ gridColumn: "span 2" }}>
										<Typography variant="subtitle2" textAlign="center" width={1}>9</Typography>
									</StyledTableCell>
									<StyledTableCell sx={{ gridColumn: "span 2" }}>
									</StyledTableCell>
								</StyledGridBox>
								<StyledGridBox gridTemplateColumns={`repeat(${Object.keys(days).length + 11}, minmax(40px, 1fr))`}>
									<StyledTableCell sx={{ gridColumn: "span 5", justifyContent: "right" }}>
										<Typography variant="subtitle2" fontWeight={700} sx={{ paddingRight: "4px" }}>Total Manhours</Typography>
									</StyledTableCell>
									{Object.entries(days).map(([d, v]) => {
										return (
											<StyledTableCell sx={{ justifyContent: "center" }} key={d}><Typography variant="subtitle2">{v?.manpower ? v.manpower * 9 : 0}</Typography></StyledTableCell>
										)
									})}
									<StyledTableCell sx={{ gridColumn: "span 2" }}>
										<Typography variant="subtitle2" textAlign="center" fontWeight={700} width={1}>{totalMpMh.mh}</Typography>
									</StyledTableCell>
									<StyledTableCell sx={{ gridColumn: "span 2" }}>
										<Typography variant="subtitle2" textAlign="center" width={1}></Typography>
									</StyledTableCell>
								</StyledGridBox>
							</Stack>
						</Scrollbar>
					)}
				</Card>
			</Container>
		</>
	)
}


function getTbtByYear ({ tbt = [], positions = [] }) {
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
	return tbtByDate;
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

export default TBTReportPage