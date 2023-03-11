import { useEffect, useMemo, useRef, useState } from 'react';
import { getMonth, getYear } from 'date-fns';
// @mui
const { Grid, Container, Button, TextField, Box, Typography, Stack, Divider, useTheme } = await import('@mui/material');
const { MobileDatePicker } = await import('@mui/x-date-pickers');
// _mock_
import { _bookingsOverview } from '@/_mock/arrays';
// utils
import { fTimestamp } from '@/utils/formatTime';
// components
import { useSettingsContext } from '@/Components/settings';
import useResponsive from '@/hooks/useResponsive';
// sections
const {
	AnalyticsCurrentVisits,
	AnalyticsWebsiteVisits,
	AnalyticsWidgetSummary,
	AnalyticsTBTLine,
	AnalyticsTBTWorkDays,
	AnalyticsTable
} = await import('@/sections/@dashboard/general/analytics');
const { AppWelcome } = await import('@/sections/@dashboard/general/app');
const { EcommerceNewProducts } = await import('@/sections/@dashboard/general/e-commerce');
const { WelcomeIllustration } = await import('@/assets/illustrations/WelcomeIllustration');
import Iconify from '@/Components/iconify';
const {
	FileGeneralDataActivity,
	FileGeneralStorageOverview
} = await import('@/sections/@dashboard/general/file');
const { BookingBookedRoom } = await import('@/sections/@dashboard/general/booking');


// ----------------------------------------------------------------------
const GB = 1000000000 * 24;
const TIME_LABELS = {
	week: ['Mon', 'Tue', 'Web', 'Thu', 'Fri', 'Sat', 'Sun'],
	month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	year: ['2018', '2019', '2020', '2021', '2022'],
};

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


export default function GeneralHSEDasboardPage ({ user, totalTbtByYear, trainings, tbtStatistics }) {
	const [tbtData, setTbtData] = useState([]);
	const [filteredTbtData, setFilteredTbtData] = useState([]);
	const [startTbtDate, setStartTbtDate] = useState(null);
	const [startTbtDateHandler, setTbtStartDateHandler] = useState(null);
	const [endTbtDate, setEndTbtDate] = useState(null);
	const [endTbtDateHandler, setEndTbtDateHandler] = useState(null);
	const endTbtDateRef = useRef();

	const theme = useTheme();
	const isTablet = useResponsive('down', 'lg');

	const { themeStretch } = useSettingsContext();

	useEffect(() => {
		if (totalTbtByYear) {
			const tmpTotalTbtByYear = { ...totalTbtByYear };
			const tbtAndStatistics = tbtStatistics.reduce((acc, curr) => {
				const statInTbtTotal = curr.year in tmpTotalTbtByYear;
				let months = {};
				if (statInTbtTotal) {
					curr.months.forEach(month => {
						months[month.month_code] = {
							...tmpTotalTbtByYear[curr.year][month.month_code],
							totalManpower: tmpTotalTbtByYear[curr.year][month.month_code].totalManpower + month.manpower,
							totalManhours: tmpTotalTbtByYear[curr.year][month.month_code].totalManhours + month.manhours,
							safeManhours: tmpTotalTbtByYear[curr.year][month.month_code].safeManhours + month.manhours,
						}
					});
					delete tmpTotalTbtByYear[curr.year];
				} else {
					curr.months.forEach(month => {
						months[month.month_code] = {
							totalManpower: month.manpower,
							totalManhours: month.manhours,
							location: new Set,
							totalManpowerAveDay: 0,
							safeManhours: month.manhours,
							daysWork: 0,
							daysWoWork: 0
						}
					});
				}
				return {
					...acc,
					[curr.year]: months
				};
			}, totalTbtByYear);
			let years = new Set;

			const tbt = Object.entries(tbtAndStatistics).reduce((acc, curr) => {
				years.add(curr[0]);
				const monthsData = Object.entries(curr[1]);
				monthsData.forEach(d => d.push(curr[0]));
				acc.push(...monthsData);
				return acc;
			}, []);

			const yStart = Array.from(years).at(0) ? new Date(Array.from(years).at(0), 0, 1) : 0;
			const yEnd = Array.from(years).at(0) ? new Date(Array.from(years).at(0), 11, 1) : 0;
			setStartTbtDate(yStart);
			setTbtStartDateHandler(yStart);
			setEndTbtDate(yEnd);
			setEndTbtDateHandler(yEnd);
			setFilteredTbtData(tbt.slice(0, 12));
			setTbtData(tbt);
		}
	}, [totalTbtByYear, tbtStatistics]);

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
		const total = tbtData.find(t => (t[0] === curr[0] && t[2] === curr[2]));
		if (total) {
			acc.totalManpower += total[1].totalManpower;
			acc.totalManhours += total[1].totalManhours;
			acc.safeManhours += total[1].safeManhours;
			acc.daysWork += total[1].daysWork;
			acc.daysWoWork += total[1].daysWoWork;
			acc.location = new Set([...acc.location, ...total[1].location]);
		}
		return acc;
	}, {
		totalManpower: 0,
		totalManhours: 0,
		safeManhours: 0,
		daysWork: 0,
		daysWoWork: 0,
		location: new Set
	}), [filteredTbtData]);

	const tbtDataItd = useMemo(() => tbtData?.reduce((acc, curr, _idx, arr) => {
		const currMonth = curr[0];
		const currTotal = {
			totalManpower: acc.totalManpower + curr[1].totalManpower,
			totalManhours: acc.totalManhours + curr[1].totalManhours,
			daysWork: acc.daysWork + curr[1].daysWork,
			daysWoWork: acc.daysWoWork + curr[1].daysWoWork,
			location: new Set([...acc.location, ...curr[1].location])
		}
		if (curr[2] in totalTbtByYear) {
			return calculateItd({ monthsObj: totalTbtByYear[curr[2]], currMonth, currTotal });
		} else {
			const currYear = arr.filter(a => a[2] === curr[2]);
			let monthsObj = {};
			currYear.forEach(d => {
				monthsObj[d[0]] = d[1];
			})
			return calculateItd({ monthsObj, currMonth, currTotal });
		}
	}, {
		totalManpower: 0,
		totalManhours: 0,
		daysWork: 0,
		daysWoWork: 0,
		location: new Set
	}), [tbtData]);

	const trainingComputedData = trainings.reduce((acc, curr) => {
		if (curr.training_files_count > 0) {
			const trainingDate = new Date(curr.training_date);
			const isInMonths = startTbtDate && endTbtDate ? fTimestamp(trainingDate) >= startTbtDate.setHours(0, 0, 0, 0) && fTimestamp(trainingDate) <= endTbtDate.setHours(0, 0, 0, 0) : false;

			if (curr.type === 4) {
				acc.completedInduction += 1;
				if (isInMonths) {
					acc.completedInductionMonth += 1;
				}
			}
			acc.trainingHoursCompleted += curr.training_hrs;
			if (isInMonths) {
				acc.trainingHoursCompletedMonth += curr.training_hrs;
			}
		}
		return acc;
	}, {
		trainingHoursCompleted: 0,
		trainingHoursCompletedMonth: 0,
		completedInduction: 0,
		completedInductionMonth: 0
	});

	const getTbtMonthChartData = () => {
		if (endTbtDateHandler) {
			const y = endTbtDateHandler.getFullYear();
			const m = endTbtDateHandler.getMonth() + 1;
			const dataIdx = tbtData.findIndex(tbt => tbt[2] == y && tbt[0] == m);
			const startIdx = dataIdx <= 11 ? 0 : dataIdx - 11;
			const tbtRolling = tbtData.slice(startIdx, dataIdx + 1);
			const tbtWorks = tbtRolling.reduce((acc, curr) => ({
				daysWork: acc.daysWork + (curr[1]?.daysWork || 0),
				daysWoWork: acc.daysWoWork + (curr[1]?.daysWoWork || 0)
			}), { daysWork: 0, daysWoWork: 0 })
			return {
				tbt: tbtRolling,
				...tbtWorks
			}
		}
		return {
			tbt: [],
			daysWork: 0,
			daysWoWork: 0,
		};
	}
	const tbtMonthChartData = getTbtMonthChartData();
	const years = new Set(tbtData.map(d => d[2]));
	const monthsDiff = monthDiff(startTbtDateHandler, endTbtDateHandler);

	return (
		<Container maxWidth={themeStretch ? false : 'xl'}>

			<Grid container spacing={3}>
				<Grid item xs={12} md={8}>
					<AppWelcome
						title={`Health and Safety Management Software`}
						description="The Fiafi Group Safety Management Software makes it simple to administer the Health and Safety program of an organization. Capture, monitor, and report safety program data, analyze trends, and gain insights from user- friendly interfaces, all while meeting workplace compliance requirements and reducing administrative work."
						img={
							<WelcomeIllustration
								sx={{
									p: 3,
									width: 1,
									margin: { xs: 'auto', md: 'inherit' },
								}}
							/>
						}
						action={
							<Stack direction="row" spacing={2.5} alignItems="center">
								<Button variant="contained">Go Now</Button>
								<Typography paragraph variant="h5" sx={{ whiteSpace: 'pre-line' }}>
									{`Welcome back! \n ${user?.employee?.fullname || user?.firstname}`}
								</Typography>
							</Stack>
						}
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
									minDate={new Date(Array.from(years).at(0), 0, 1)}
									maxDate={new Date(Array.from(years).at(-1), 11, 1)}
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
									maxDate={new Date(Array.from(years).at(-1), 11, 1)}
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
						title="MANPOWER"
						total={tbtAnalytic.totalManpower}
						icon={'simple-line-icons:user'}
					/>
				</Grid>

				<Grid item xs={12} sm={6} md={3}>
					<AnalyticsWidgetSummary
						title="MANPOWER/MONTH X̅"
						total={monthsDiff === 1 ?
							Math.ceil(tbtAnalytic.totalManpower / new Date(+filteredTbtData[0][2], +filteredTbtData[0][0], 0).getDate())
							: Math.ceil(tbtAnalytic.totalManpower / (monthsDiff || 0))
						}
						color="info"
						icon={'material-symbols:supervisor-account-outline'}
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
			</Grid>

			<Divider variant="middle" sx={{ my: 3 }} />

			<Grid container spacing={2} >
				<Grid item xs={12} md={7} lg={5} order={{ md: 1, lg: 1 }}>
					<AnalyticsTable
						headTitles={[{ title: "HSE Data" }, { title: "Month", align: "right" }, { title: "ITD", align: "right" }]}
						data={[
							{
								title: "Total Days Work",
								month: tbtAnalytic?.daysWork || 0,
								itd: tbtDataItd?.daysWork || 0,
							},
							{
								title: "Total Days w/o Work",
								month: tbtAnalytic?.daysWoWork || 0,
								itd: tbtDataItd?.daysWoWork || 0,
							},
							{
								title: "Total Work Location",
								month: tbtAnalytic?.location?.size || 0,
								itd: tbtDataItd?.location?.size || 0,
							},
							{
								title: "Number of Training Hours Completed",
								month: trainingComputedData.trainingHoursCompletedMonth || 0,
								itd: trainingComputedData.trainingHoursCompleted || 0,
							},
							{
								title: "Number of HSE Induction Completed",
								month: trainingComputedData.completedInductionMonth || 0,
								itd: trainingComputedData.completedInduction || 0,
							},
							{
								title: "Number of HSE Enforcement Notices Issued",
								month: 0,
								itd: 0
							},
							{
								title: "Number of HSE Audit (plan v actual) (%)",
								month: 0,
								itd: 0
							},
							{
								title: "HSE Leadership Tours (plan v actual) (%)",
								month: 0,
								itd: 0
							},
						]}
					/>
				</Grid>

				<Grid item xs={12} md={12} lg={5} order={{ md: 3, lg: 2 }}>
					<AnalyticsTBTLine
						height={isTablet ? 364 : 240}
						title="Hours Worked / Month"
						subheader="(12 month rolling)"
						chart={{
							labels: tbtMonthChartData.tbt.map(d => `${MONTH_NAMES[d[0]]} ${d[2]}`),
							series: tbtMonthChartData.tbt.reduce((acc, curr) => {
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
				<Grid item xs={12} md={5} lg={2} order={{ md: 2, lg: 3 }}>
					<AnalyticsTBTWorkDays
						title="Work Days"
						chart={{
							series: [
								{ label: 'Days Work', value: tbtMonthChartData?.daysWork || 0 },
								{ label: 'Days Without Work', value: tbtMonthChartData?.daysWoWork || 0 },
							],
							colors: [
								theme.palette.primary.main,
								theme.palette.error.main,
							],
						}}
					/>
				</Grid>
			</Grid>


			<Divider variant="middle" sx={{ my: 3 }} />


			<Grid container spacing={3} >
				<Grid item xs={12} md={7} lg={5} order={{ md: 1, lg: 1 }}>
					<AnalyticsTable
						headTitles={[{ title: "Accidents and Incidents" }, { title: "Month", align: "right" }, { title: "ITD", align: "right" }]}
						data={[
							{ title: "Fatality", month: 0, itd: 0 },
							{ title: "Major", month: 0, itd: 0 },
							{ title: "Significant", month: 0, itd: 0 },
							{ title: "Minor", month: 0, itd: 0 },
							{ title: "Number of Near Miss Reports Received", month: 0, itd: 0 },
							{ title: "Total Recordable Injuries (TRIs)", month: 0, itd: 0 },
							{ title: "Lost Time Injury Frequency Rate (LTIFR)", month: 0, itd: 0 },
							{ title: "Lost Time Injury Severity Rate (LTISR)", month: 0, itd: 0 },
							{ title: "Total Reportable Case Frequency (TRCF)", month: 0, itd: 0 },
							{ title: "Fatal Accident Frequency Rate (FAFR)", month: 0, itd: 0 },
						]}
						color="error"
					/>
				</Grid>

				<Grid item xs={12} md={12} lg={5} order={{ md: 3, lg: 2 }}>
					<AnalyticsWebsiteVisits
						height={isTablet ? 364 : 240}
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
						sx={{ height: "100%" }}
					/>
				</Grid>

				<Grid item xs={12} md={5} lg={2} order={{ md: 2, lg: 3 }}>
					<AnalyticsCurrentVisits
						title="Open vs Close"
						height={160}
						type="donut"
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
						sx={{ height: "100%" }}
					/>
				</Grid>
			</Grid>

			<Divider variant="middle" sx={{ my: 3 }} />


			<Grid container spacing={3} >
				<Grid item xs={12} md={12} lg={5}>
					<Stack spacing={2}>
						<AnalyticsTable
							headTitles={[{ title: "Recordable Cases" }, { title: "Month", align: "right" }, { title: "ITD", align: "right" }]}
							data={[
								{ title: "No of Restricted Work Cases", month: 0, itd: 0 },
								{ title: "No of Occupational Illnesses", month: 0, itd: 0 },
								{ title: "No of Occupational Fatalities", month: 0, itd: 0 },
								{ title: "No of Medical Treatment Cases", month: 0, itd: 0 },
								{ title: "No of Loss Consciousness Cases", month: 0, itd: 0 },
							]}
							color="warning"
							sx={{ mb: 1 }}
						/>
						<AnalyticsTable
							headTitles={[{ title: "Non Recordable" }, { title: "Month", align: "right" }, { title: "ITD", align: "right" }]}
							data={[
								{ title: "No of First Aid Cases", month: 0, itd: 0 },
								{ title: "No of Near Misses", month: 0, itd: 0 }
							]}
						/>
					</Stack>
				</Grid>

				<Grid item xs={12} md={12} lg={7}>
					<FileGeneralDataActivity
						height={isTablet ? 280 : 240}
						title="Data Activity"
						sx={{ height: "100%" }}
						chart={{
							labels: TIME_LABELS,
							colors: [
								theme.palette.primary.main,
								theme.palette.error.main,
								theme.palette.warning.main,
								theme.palette.text.disabled,
							],
							series: [
								{
									type: 'Week',
									data: [
										{ name: 'Images', data: [20, 34, 48, 65, 37, 48] },
										{ name: 'Media', data: [10, 34, 13, 26, 27, 28] },
										{ name: 'Documents', data: [10, 14, 13, 16, 17, 18] },
										{ name: 'Other', data: [5, 12, 6, 7, 8, 9] },
									],
								},
								{
									type: 'Month',
									data: [
										{ name: 'Images', data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 12, 43, 34] },
										{ name: 'Media', data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 12, 43, 34] },
										{ name: 'Documents', data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 12, 43, 34] },
										{ name: 'Other', data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 12, 43, 34] },
									],
								},
								{
									type: 'Year',
									data: [
										{ name: 'Images', data: [10, 34, 13, 56, 77] },
										{ name: 'Media', data: [10, 34, 13, 56, 77] },
										{ name: 'Documents', data: [10, 34, 13, 56, 77] },
										{ name: 'Other', data: [10, 34, 13, 56, 77] },
									],
								},
							],
						}}
					/>
				</Grid>
			</Grid>


			<Divider variant="middle" sx={{ my: 3 }} />


			<Grid container spacing={3} >
				<Grid item xs={12} md={12} lg={5} height={1}>
					<Stack spacing={2} height={1}>
						<AnalyticsTable
							headTitles={[{ title: "Other Incidents" }, { title: "Month", align: "right" }, { title: "ITD", align: "right" }]}
							data={[
								{ title: "No of Property Damage", month: 0, itd: 0 },
								{ title: "No of Spill & Leaks", month: 0, itd: 0 },
								{ title: "No of Other Environ. incidents", month: 0, itd: 0 },
								{ title: "No of Fires", month: 0, itd: 0 },
								{ title: "No of Vehicle Accidents", month: 0, itd: 0 },
							]}
							color="error"
							sx={{ mb: 1 }}
						/>
						<AnalyticsTable
							headTitles={[{ title: "HSE KPI's" }, { title: "Month", align: "right" }, { title: "ITD", align: "right" }]}
							data={[
								{ title: "Attended HSE Leadership Training (%)", month: 0, itd: 0 },
								{ title: "Attended HSE Supervisors Training (%)", month: 0, itd: 0 },
								{ title: "Incident Reports Submitted on Time (%)", month: 0, itd: 0 },
								{ title: "Incident Recommendations Closed on Time", month: 0, itd: 0 },
								{ title: "Corrective Actions Closed on Time", month: 0, itd: 0 },
								{ title: "Accident Frequency Rate (12 month rolling)", month: 0, itd: 0 },
							]}
							color="secondary"
						/>
					</Stack>
				</Grid>

				<Grid item xs={12} md={6} lg={3}>
					<FileGeneralStorageOverview
						height={isTablet ? 364 : 240}
						total={GB}
						chart={{
							series: 76,
						}}
						data={[
							{
								name: 'Images',
								usedStorage: GB / 2,
								filesCount: 223,
								icon: <Box component="img" src="/storage/assets/icons/files/ic_img.svg" />,
							},
							{
								name: 'Media',
								usedStorage: GB / 5,
								filesCount: 223,
								icon: <Box component="img" src="/storage/assets/icons/files/ic_video.svg" />,
							},
							{
								name: 'Documents',
								usedStorage: GB / 5,
								filesCount: 223,
								icon: <Box component="img" src="/storage/assets/icons/files/ic_document.svg" />,
							},
							{
								name: 'Other',
								usedStorage: GB / 10,
								filesCount: 223,
								icon: <Iconify icon="eva:file-fill" width={24} sx={{ color: 'text.disabled' }} />,
							},
						]}
					/>
				</Grid>

				<Grid item xs={12} md={6} lg={4}>
					<BookingBookedRoom title="Booked Room" data={_bookingsOverview} />
				</Grid>
			</Grid>


			<Divider variant="middle" sx={{ my: 3 }} />



		</Container>
	);
}

function calculateItd ({ monthsObj, currMonth, currTotal }) {
	const prevMonth = +currMonth - 1;
	if (prevMonth in monthsObj) {
		const month = monthsObj[prevMonth];
		const total = {
			totalManpower: currTotal.totalManpower + month.totalManpower,
			totalManhours: currTotal.totalManhours + month.totalManhours,
			daysWork: currTotal.daysWork + month.daysWork,
			daysWoWork: currTotal.daysWoWork + month.daysWoWork,
			location: new Set([...currTotal.location, ...month.location])
		};
		return calculateItd({ monthsObj, currMonth: prevMonth, currTotal: total });
	} else {
		return currTotal;
	}
}

function monthDiff (dateFrom, dateTo) {
	if (dateFrom && dateTo) {
		return dateTo.getMonth() - dateFrom.getMonth() +
			(12 * (dateTo.getFullYear() - dateFrom.getFullYear())) + 1
	}
}