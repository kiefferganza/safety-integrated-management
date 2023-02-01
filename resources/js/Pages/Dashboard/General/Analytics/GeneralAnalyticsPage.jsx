import { useEffect, useMemo, useRef, useState } from 'react';
import { getMonth, getYear } from 'date-fns';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Button, TextField, Box, Typography } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
// _mock_
import { _analyticPost, _analyticOrderTimeline, _analyticTraffic, _ecommerceNewProducts } from '@/_mock/arrays';
// utils
import { fTimestamp } from '@/utils/formatTime';
// components
import { useSettingsContext } from '@/Components/settings';
// sections
import {
	AnalyticsTasks,
	AnalyticsNewsUpdate,
	AnalyticsOrderTimeline,
	AnalyticsCurrentVisits,
	AnalyticsWebsiteVisits,
	AnalyticsTrafficBySite,
	AnalyticsWidgetSummary,
	AnalyticsCurrentSubject,
	AnalyticsConversionRates,
	AnalyticsTBTLine,
	AnalyticsTBTWorkDays
} from '@/sections/@dashboard/general/analytics';
import { AppWelcome } from '@/sections/@dashboard/general/app';
import { EcommerceNewProducts } from '@/sections/@dashboard/general/e-commerce';
import WelcomeIllustration from '@/assets/illustrations/WelcomeIllustration';
import LoadingScreen from '@/Components/loading-screen';
import Iconify from '@/Components/iconify';


// ----------------------------------------------------------------------

const COVER_IMAGES = [
	{
		id: 1,
		image: "/storage/assets/covers/card-cover-1.jpg",
		name: ""
	},
	{
		id: 2,
		image: "/storage/assets/covers/card-cover-2.jpg",
		name: ""
	},
	{
		id: 3,
		image: "/storage/assets/covers/card-cover-3.jpg",
		name: ""
	},
	{
		id: 4,
		image: "/storage/assets/covers/card-cover-4.jpg",
		name: ""
	},
	{
		id: 5,
		image: "/storage/assets/covers/card-cover-5.jpg",
		name: ""
	},
	{
		id: 6,
		image: "/storage/assets/covers/card-cover-6.jpg",
		name: ""
	},
	{
		id: 7,
		image: "/storage/assets/covers/card-cover-7.jpg",
		name: ""
	},
];

const MONTH_NAMES = {
	1: 'Jan',
	2: 'Feb',
	3: 'Mar',
	4: 'Apr',
	5: 'May',
	6: 'Jun',
	7: 'Jul',
	8: 'Aug',
	9: 'Sep',
	10: 'Oct',
	11: 'Nov',
	12: 'Dec',
}


export default function GeneralAnalyticsPage ({ user, totalTbtByYear, tbtByYear, employeesCount }) {
	const [tbtData, setTbtData] = useState([]);
	const [filteredTbtData, setFilteredTbtData] = useState([]);
	const [startTbtDate, setStartTbtDate] = useState(null);
	const [startTbtDateHandler, setTbtStartDateHandler] = useState(null);
	const [endTbtDate, setEndTbtDate] = useState(null);
	const [endTbtDateHandler, setEndTbtDateHandler] = useState(null);
	const endTbtDateRef = useRef();

	const theme = useTheme();

	const { themeStretch } = useSettingsContext();

	useEffect(() => {
		if (totalTbtByYear) {
			const yStart = Object.keys(totalTbtByYear).at(0) ? new Date(Object.keys(totalTbtByYear).at(0), 0, 1) : 0;
			const yEnd = Object.keys(totalTbtByYear).at(0) ? new Date(Object.keys(totalTbtByYear).at(0), 11, 1) : 0;
			setStartTbtDate(yStart);
			setTbtStartDateHandler(yStart);
			setEndTbtDate(yEnd);
			setEndTbtDateHandler(yEnd);
			const tbt = Object.entries(totalTbtByYear).reduce((acc, curr) => {
				const monthsData = Object.entries(curr[1]);
				monthsData.forEach(d => d.push(curr[0]));
				acc.push(...monthsData);
				return acc;
			}, []);
			setFilteredTbtData(tbt.slice(0, 12));
			setTbtData(tbt);
		}
	}, [totalTbtByYear]);

	const filterTbtBySelectedDate = (start, end) => {
		const selStartYear = getYear(start);
		const selStartMonth = getMonth(start) + 1;
		const selEndYear = getYear(end);
		const selEndMonth = getMonth(end) + 1;

		const filteredTbt = tbtData.filter((d) => {
			const m = d[0];
			const y = d[2];
			const isStart = (m >= selStartMonth && y == selStartYear);
			const isEnd = (m <= selEndMonth && y == selEndYear);
			if (selStartYear === selEndYear) return isStart && isEnd;
			return isStart || isEnd;
		});
		setFilteredTbtData(filteredTbt);
	}


	const handleStartTbtDateChange = (newDate) => {
		setTbtStartDateHandler(newDate);
	}

	const onStartTbtDateAccept = (newDate) => {
		setStartTbtDate(newDate);
		if (fTimestamp(newDate) > fTimestamp(endTbtDateHandler)) {
			endTbtDateRef.current.click();
		} else {
			filterTbtBySelectedDate(newDate, endTbtDate);
		}
	}

	const handleTbtEndDateChange = (newDate) => {
		setEndTbtDateHandler(newDate);
	}

	const onTbtEndDateAccept = (newDate) => {
		setEndTbtDate(newDate);
		filterTbtBySelectedDate(startTbtDate, newDate);
	}

	const tbtAnalytic = useMemo(() => filteredTbtData?.reduce((acc, curr) => {
		const total = totalTbtByYear[curr[2]][curr[0]];
		acc.totalManpower += total.totalManpower;
		acc.totalManhours += total.totalManhours;
		acc.safeManhours += total.safeManhours;
		acc.daysWork += total.daysWork;
		acc.daysWoWork += total.daysWoWork;
		return acc;
	}, {
		totalManpower: 0,
		totalManhours: 0,
		safeManhours: 0,
		daysWork: 0,
		daysWoWork: 0,
	}), [filteredTbtData]);

	return (
		<Container maxWidth={themeStretch ? false : 'xl'}>

			<Grid container spacing={3}>

				<Grid item xs={12} md={8}>
					<AppWelcome
						title={`Welcome back! \n ${user?.firstname}`}
						description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything."
						img={
							<WelcomeIllustration
								sx={{
									p: 3,
									width: 360,
									margin: { xs: 'auto', md: 'inherit' },
								}}
							/>
						}
						action={<Button variant="contained">Go Now</Button>}
					/>
				</Grid>

				<Grid item xs={12} md={4}>
					<EcommerceNewProducts list={COVER_IMAGES} />
				</Grid>

				<Grid item md={12}>
					<Box display="flex" justifyContent="end">
						<Box>
							<Typography variant="subtitle2" fontWeight={700} mb={1} textAlign="right">Filter By Date</Typography>
							<Box display="flex" gap={2}>
								<MobileDatePicker
									label="Start Date"
									value={startTbtDateHandler}
									onChange={handleStartTbtDateChange}
									onAccept={onStartTbtDateAccept}
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
									disabled={!startTbtDate}
									label="End Date"
									value={endTbtDateHandler}
									onChange={handleTbtEndDateChange}
									onAccept={onTbtEndDateAccept}
									minDate={startTbtDateHandler}
									maxDate={new Date(Object.keys(tbtByYear).at(-1), 11, 1)}
									inputFormat="MMM yyyy"
									openTo="year"
									showToolbar
									views={['year', 'month']}
									ref={endTbtDateRef}
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
							</Box>
						</Box>
					</Box>
				</Grid>

				<Grid item xs={12} sm={6} md={3}>
					<AnalyticsWidgetSummary
						title="EMPLOYEES"
						total={employeesCount || 0}
						icon={'material-symbols:supervisor-account-outline'}
					/>
				</Grid>

				<Grid item xs={12} sm={6} md={3}>
					<AnalyticsWidgetSummary
						title="MANPOWER"
						total={tbtAnalytic.totalManpower}
						color="info"
						icon={'simple-line-icons:user'}
					/>
				</Grid>

				<Grid item xs={12} sm={6} md={3}>
					<AnalyticsWidgetSummary
						title="MANHOURS"
						total={tbtAnalytic.totalManhours}
						icon={'mdi:clock-time-four-outline'}
						color="warning"
					/>
				</Grid>

				<Grid item xs={12} sm={6} md={3}>
					<AnalyticsWidgetSummary
						title="SAFE MANHOURS"
						total={tbtAnalytic.safeManhours}
						color="success"
						icon={'mdi:clock-time-four-outline'}
					/>
				</Grid>



				<Grid item xs={12} md={6} lg={8}>
					<AnalyticsTBTLine
						title="Monthly Toolbox Talk"
						chart={{
							labels: filteredTbtData.map(d => `${MONTH_NAMES[d[0]]} ${d[2]}`),
							series: filteredTbtData.reduce((acc, curr) => {
								acc[0].data.push(curr[1].totalManpower);
								acc[1].data.push(curr[1].totalManhours);
								acc[2].data.push(curr[1].safeManhours);
								return acc;
							}, [
								{
									name: 'Manpower',
									type: 'column',
									fill: 'solid',
									data: [],
								},
								{
									name: 'Man Hours',
									type: 'column',
									fill: 'solid',
									data: [],
								},
								{
									name: 'Safe Man Hours',
									type: 'column',
									fill: 'solid',
									data: [],
								}
							]),
							colors: [
								theme.palette.primary.main,
								theme.palette.error.main,
							],
						}}
					/>
				</Grid>

				<Grid item xs={12} md={6} lg={4}>
					<AnalyticsTBTWorkDays
						title="Work Days"
						chart={{
							series: [
								{ label: 'Days Work', value: tbtAnalytic?.daysWork || 0 },
								{ label: 'Days Without Work', value: tbtAnalytic?.daysWoWork || 0 },
							],
							colors: [
								theme.palette.primary.main,
								theme.palette.error.main,
							],
						}}
					/>
				</Grid>

				<Grid item xs={12} md={6} lg={8}>
					<AnalyticsWebsiteVisits
						title="Trending Observation"
						subheader=""
						chart={{
							labels: [
								'01/01/2003',
								'02/01/2003',
								'03/01/2003',
								'04/01/2003',
								'05/01/2003',
								'06/01/2003',
								'07/01/2003',
								'08/01/2003',
								'09/01/2003',
								'10/01/2003',
								'11/01/2003',
							],
							series: [
								{
									name: 'Team A',
									type: 'column',
									fill: 'solid',
									data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
								},
								{
									name: 'Team B',
									type: 'area',
									fill: 'gradient',
									data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
								},
								{
									name: 'Team C',
									type: 'line',
									fill: 'solid',
									data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
								},
							],
						}}
					/>
				</Grid>

				<Grid item xs={12} md={6} lg={4}>
					<AnalyticsCurrentVisits
						title="Open vs Close"
						chart={{
							series: [
								{ label: 'Open', value: 5435 },
								{ label: 'Close', value: 4344 },
							],
							colors: [
								theme.palette.primary.main,
								theme.palette.error.main,
							],
						}}
					/>
				</Grid>

				<Grid item xs={12} md={6} lg={8}>
					<AnalyticsConversionRates
						title="Leading Indicators"
						// subheader="(+43%) than last year"
						chart={{
							series: [
								{ label: '', value: 400 },
								{ label: '', value: 430 },
								{ label: '', value: 448 },
								{ label: '', value: 470 },
								{ label: '', value: 540 },
								{ label: '', value: 580 },
								{ label: '', value: 690 },
								{ label: '', value: 1100 },
								{ label: '', value: 1200 },
								{ label: '', value: 1380 },
							],
						}}
					/>
				</Grid>

				<Grid item xs={12} md={6} lg={4}>
					<AnalyticsCurrentSubject
						title="Lagging Indicators"
						chart={{
							categories: ['', '', '', '', '', ''],
							series: [
								{ name: '', data: [80, 50, 30, 40, 100, 20] },
								{ name: '', data: [20, 30, 40, 80, 20, 80] },
								{ name: '', data: [44, 76, 78, 13, 43, 10] },
							],
						}}
					/>
				</Grid>

				<Grid item xs={12} md={6} lg={8}>
					{/* <AnalyticsNewsUpdate title="News Update" list={[]} /> */}
				</Grid>

				<Grid item xs={12} md={6} lg={4}>
					{/* <AnalyticsOrderTimeline title="Order Timeline" list={[]} /> */}
				</Grid>

				<Grid item xs={12} md={6} lg={4}>
					{/* <AnalyticsTrafficBySite title="Traffic by Site" list={[]} /> */}
				</Grid>

				<Grid item xs={12} md={6} lg={8}>
					{/* <AnalyticsTasks
						title="Tasks"
						list={[
							{ id: '1', label: 'Create FireStone Logo' },
							{ id: '2', label: 'Add SCSS and JS files if required' },
							{ id: '3', label: 'Stakeholder Meeting' },
							{ id: '4', label: 'Scoping & Estimations' },
							{ id: '5', label: 'Sprint Showcase' },
						]}
					/> */}
				</Grid>
			</Grid>
		</Container>
	);
}
