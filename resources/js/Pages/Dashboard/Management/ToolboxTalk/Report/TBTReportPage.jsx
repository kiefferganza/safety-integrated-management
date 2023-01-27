import { useCallback, useEffect, useRef, useState } from 'react';
import { getMonth, getYear } from 'date-fns';
// mui
import { Box, Card, Checkbox, Container, Divider, FormControl, IconButton, InputLabel, ListItemText, MenuItem, Select, Stack, TextField, Typography, useTheme } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// redux
import { dispatch, useSelector } from '@/redux/store';
import { convertTbtByYear, getTbts, } from '@/redux/slices/toolboxtalk';
// utils
import { fTimestamp } from '@/utils/formatTime';
// Components
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs/CustomBreadcrumbs';
import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import { useSettingsContext } from '@/Components/settings';
import Scrollbar from '@/Components/scrollbar';
import Iconify from '@/Components/iconify';
import EmptyContent from '@/Components/empty-content';
import ToolboxTalkAnalytic from '@/sections/@dashboard/toolboxtalks/ToolboxTalkAnalytic';
import TBTReportTable from './TBTReportTable';
import { useMemo } from 'react';

const TODAY = new Date;
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

const TYPES = {
	'All': 0,
	'Civil': 1,
	'Electrical': 2,
	'Mechanical': 3,
	'Camp': 4,
	'Office': 5,
};

const TBTReportPage = ({ positions }) => {
	const { toolboxTalks, tbtByYear, tbtYearTotalByPosition, totalTbtByYear, isLoading } = useSelector(state => state.toolboxtalk);
	const { themeStretch } = useSettingsContext();
	const theme = useTheme();
	const [yearSelected, setYearSelected] = useState(null);

	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState();
	const [startDate, setStartDate] = useState(null);
	const [startDateHandler, setStartDateHandler] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [endDateHandler, setEndDateHandler] = useState(null);
	const endDateRef = useRef();


	const [filterType, setFilterType] = useState([
		'All',
		'Civil',
		'Electrical',
		'Mechanical',
		'Camp',
		'Office',
	]);

	const filterTbtBySelectedDate = (start, end) => {
		const selStartYear = getYear(start);
		const selStartMonth = getMonth(start) + 1;
		const selEndYear = getYear(end);
		const selEndMonth = getMonth(end) + 1;


		const filteredTbt = data.filter((d) => {
			const m = d[0];
			const y = d[2];
			const isStart = (m >= selStartMonth && y == selStartYear);
			const isEnd = (m <= selEndMonth && y == selEndYear);
			if (selStartYear === selEndYear) return isStart && isEnd;
			return isStart || isEnd;
		});
		setFilteredData(filteredTbt);
	}


	const handleStartDateChange = (newDate) => {
		setStartDateHandler(newDate);
	}

	const onStartDateAccept = (newDate) => {
		setStartDate(newDate);
		if (fTimestamp(newDate) > fTimestamp(endDateHandler)) {
			endDateRef.current.click();
		} else {
			filterTbtBySelectedDate(newDate, endDate);
		}
	}

	const handleEndDateChange = (newDate) => {
		setEndDateHandler(newDate);
	}

	const onEndDateAccept = (newDate) => {
		setEndDate(newDate);
		filterTbtBySelectedDate(startDate, newDate);
	}


	const handleFilterType = (event) => {
		const {
			target: { value },
		} = event;
		const isAll = value.some(val => val === "All");
		let newVal = typeof value === 'string' ? value.split(',') : value;

		const isAllChecked = filterType.some(val => val === "All");

		if (typeof value !== 'string') {
			if (isAllChecked && !isAll) {
				newVal = [];
			} else if (isAll && (newVal.length === 1 || newVal.at(-1) === "All")) {
				newVal = [
					'All',
					'Civil',
					'Electrical',
					'Mechanical',
					'Camp',
					'Office',
				]
			} else {
				newVal = value.filter(val => val !== "All");
			}
		}
		if (newVal.length > 0) {
			const types = newVal.map(ft => TYPES[ft]);
			const filteredTbt = toolboxTalks.filter((toolbox) => types.indexOf(+toolbox.tbt_type) !== -1);
			convertTbtByYear({ tbt: filteredTbt, positions });
		} else {
			convertTbtByYear({ tbt: toolboxTalks, positions });
		}
		setFilterType(newVal);
	};

	useEffect(() => {
		if (tbtByYear === null || tbtYearTotalByPosition === null || toolboxTalks === null) {
			dispatch(getTbts());
		}
		if (yearSelected === null && tbtByYear !== null) {
			const y = Object.keys(tbtByYear).at(0) ? new Date(Object.keys(tbtByYear).at(0), 0, 1) : 0;
			setYearSelected(Object.keys(tbtByYear).at(0) || 0);
			setStartDate(y);
			setStartDateHandler(y);
			setEndDate(y);
			setEndDateHandler(y);
			const tbtData = Object.entries(tbtByYear).reduce((acc, curr) => {
				const monthsData = Object.entries(curr[1]);
				monthsData.forEach(d => d.push(curr[0]));
				acc.push(...monthsData);
				return acc;
			}, []);
			setData(tbtData);
			setFilteredData([tbtData[0]]);
		}
	}, [tbtByYear, tbtYearTotalByPosition, totalTbtByYear]);

	const analytic = useMemo(() => filteredData?.reduce((acc, curr) => {
		const total = totalTbtByYear[curr[2]][curr[0]];
		acc.totalManpower += total.totalManpower;
		acc.totalManpowerAveDay += total.totalManpowerAveDay;
		acc.totalManhours += total.totalManhours;
		acc.safeManhours += total.safeManhours;
		acc.daysWork += total.daysWork;
		acc.daysWoWork += total.daysWoWork;
		acc.location = new Set([...acc.location, ...total.location]);
		return acc;
	}, {
		totalManpower: 0,
		totalManpowerAveDay: 0,
		totalManhours: 0,
		safeManhours: 0,
		daysWork: 0,
		daysWoWork: 0,
		location: new Set
	}), [filteredData]);

	if (isLoading || !tbtByYear || startDate === null) {
		return <LoadingScreen />
	}

	if (Object.keys(tbtByYear).length === 0 || startDate === 0) {
		return <NoData
			themeStretch={themeStretch}
			filterType={filterType}
			onTypeChange={handleFilterType}
		/>
	}

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
				/>
				<Card sx={{ mb: 5 }}>
					<Scrollbar>
						<Stack
							direction="row"
							divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
							sx={{ py: 2 }}
						>
							<ToolboxTalkAnalytic
								title="Avg. Manpower/Month"
								total={analytic.totalManpowerAveDay}
								percent={(analytic.totalManpowerAveDay * analytic.totalManpower) / 100}
								icon="akar-icons:people-group"
								color={theme.palette.success.main}
							/>

							<ToolboxTalkAnalytic
								title="Total Manpower"
								total={analytic.totalManpower}
								percent={analytic.totalManpower / 100}
								icon="akar-icons:people-group"
								color={theme.palette.info.main}
							/>

							<ToolboxTalkAnalytic
								title="Total Manhours"
								total={analytic.totalManhours}
								percent={analytic.totalManhours / 100}
								icon="tabler:clock-hour-3"
								color={theme.palette.warning.main}
							/>

							<ToolboxTalkAnalytic
								title="Safe Manhours w/o LTA"
								total={analytic.safeManhours}
								percent={analytic.safeManhours / 100}
								icon="tabler:clock-hour-3"
								color={theme.palette.success.main}
							/>

							<ToolboxTalkAnalytic
								title="Days Work"
								total={analytic.daysWork}
								percent={analytic.daysWork}
								icon="mdi:calendar-check-outline"
								color={theme.palette.success.main}
							/>

							<ToolboxTalkAnalytic
								title="Days w/o Work"
								total={analytic.daysWoWork}
								percent={analytic.daysWoWork}
								icon="mdi:calendar-remove-outline"
								color={theme.palette.error.main}
							/>
							<ToolboxTalkAnalytic
								title="Location"
								total={analytic.location.size}
								percent={100}
								icon="material-symbols:location-on-outline"
								color={theme.palette.info.main}
							/>
						</Stack>
					</Scrollbar>
				</Card>
				<Card sx={{ p: 2 }}>
					<Stack direction="row" gap={1} justifyContent="end" sx={{ mb: 2 }}>
						<FormControl sx={{ width: 1, maxWidth: 140 }} size='small'>
							<InputLabel id="tbt-type-label">TBT Type</InputLabel>
							<Select
								labelId="tbt-type-label"
								id="tbt-type"
								label="TBT Type"
								multiple
								value={filterType}
								onChange={handleFilterType}
								renderValue={(selected) => selected.join(', ')}
								fullWidth
							>
								{Object.keys(TYPES).map((name) => (
									<MenuItem sx={{ px: 0 }} key={name} value={name}>
										<Checkbox checked={filterType?.indexOf(name) > -1} />
										<ListItemText primary={name} />
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<MobileDatePicker
							label="Start Date"
							value={startDateHandler}
							onChange={handleStartDateChange}
							onAccept={onStartDateAccept}
							inputFormat="MMM yyyy"
							openTo="year"
							showToolbar
							views={['year', 'month']}
							minDate={new Date(Object.keys(tbtByYear).at(0), 0, 1)}
							maxDate={new Date(Object.keys(tbtByYear).at(-1), 11, 1)}
							renderInput={(params) => (
								<TextField
									{...params}
									size="small"
									fullWidth
									sx={{
										maxWidth: { md: 160 },
									}}
									InputProps={{
										endAdornment: (
											<Iconify icon="eva:calendar-fill" sx={{ color: 'primary.main' }} />
										)
									}}
								/>
							)}
						/>
						<MobileDatePicker
							disabled={!startDate}
							label="End Date"
							value={endDateHandler}
							onChange={handleEndDateChange}
							onAccept={onEndDateAccept}
							minDate={startDateHandler}
							maxDate={new Date(Object.keys(tbtByYear).at(-1), 11, 1)}
							inputFormat="MMM yyyy"
							openTo="year"
							showToolbar
							views={['year', 'month']}
							ref={endDateRef}
							renderInput={(params) => (
								<TextField
									{...params}
									size="small"
									fullWidth
									sx={{
										maxWidth: { md: 160 },
									}}
									InputProps={{
										endAdornment: (
											<Iconify icon="eva:calendar-fill" sx={{ color: 'primary.main' }} />
										)
									}}
								/>
							)}
						/>
					</Stack>
					{filteredData?.length > 0 ? (
						filteredData?.map((data, index) => {
							const days = data[1] || {};
							const positionData = tbtYearTotalByPosition[data[2]][data[0]] || {};
							const tbtTotal = totalTbtByYear[data[2]][data[0]] || {};
							return (
								<Box key={index}>
									<Box width={1} textAlign="center" sx={{ mt: 3, mb: 1 }}>
										<Typography variant="h6">{MONTH_NAMES[data[0]]} {data[2]}</Typography>
									</Box>
									<TBTReportTable days={days} positionData={positionData} tbtTotal={tbtTotal} />
								</Box>
							)
						})
					) : (
						<EmptyContent
							title="No Data"
							sx={{
								'& span.MuiBox-root': { height: 160 },
							}}
						/>
					)}
				</Card>
			</Container>
		</>
	)
}


function NoData ({ themeStretch, filterType, onTypeChange }) {
	return (
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
			/>
			<Card sx={{ p: 2 }}>
				<Stack direction="row" gap={1} justifyContent="end">
					<FormControl sx={{ width: 1, maxWidth: 140 }} size='small'>
						<InputLabel id="tbt-type-label">TBT Type</InputLabel>
						<Select
							labelId="tbt-type-label"
							id="tbt-type"
							label="TBT Type"
							multiple
							value={filterType}
							onChange={onTypeChange}
							renderValue={(selected) => selected.join(', ')}
							fullWidth
						>
							{Object.keys(TYPES).map((name) => (
								<MenuItem sx={{ px: 0 }} key={name} value={name}>
									<Checkbox checked={filterType?.indexOf(name) > -1} />
									<ListItemText primary={name} />
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Stack>
				<EmptyContent
					title="No Data"
					sx={{
						'& span.MuiBox-root': { height: 160 },
					}}
				/>
			</Card>
		</Container>
	)
}

export default TBTReportPage