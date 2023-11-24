import { useEffect, useMemo, useRef, useState, lazy, useCallback } from 'react';
// import { differenceInDays, format, isSameMonth, isSameYear } from 'date-fns';
import { differenceInDays, format } from 'date-fns';
// @mui
const { Box, Grid, Container, Button, TextField, Typography, Stack, Divider, useTheme } = await import('@mui/material');
const { MobileDatePicker } = await import('@mui/x-date-pickers');
// _mock_
import { _bookingsOverview } from '@/_mock/arrays';
// utils
import { fTimestamp } from '@/utils/formatTime';
import { generateYears } from '@/utils/years';
// components
import { useSettingsContext } from '@/Components/settings';
import CustomPopover, { usePopover } from '@/Components/custom-popover';
import useResponsive from '@/hooks/useResponsive';
import Iconify from '@/Components/iconify';
import { Inertia } from '@inertiajs/inertia';
// sections
// import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import Scrollbar from '@/Components/scrollbar/Scrollbar';
import { useQueries } from '@tanstack/react-query';
import axiosInstance from '@/utils/axios';
import { ButtonBase, Card, CardHeader, MenuItem, Skeleton } from '@mui/material';
const AppWelcome = lazy(() => import('@/sections/@dashboard/general/app/AppWelcome'));
const WelcomeIllustration = lazy(() => import('@/assets/illustrations/WelcomeIllustration'));
const HseSlider = lazy(() => import('@/sections/@dashboard/general/hse-dashboard/HseSlider'));
// Charts
import AnalyticsWidgetSummary from '@/sections/@dashboard/general/analytics/AnalyticsWidgetSummary';
import AnalyticsTBTLine from '@/sections/@dashboard/general/analytics/AnalyticsTBTLine';
import AnalyticsTBTWorkDays from '@/sections/@dashboard/general/analytics/AnalyticsTBTWorkDays';
import AnalyticsTable from '@/sections/@dashboard/general/analytics/AnalyticsTable';
import AnalyticsSummaryOpenCloseObservation from '@/sections/@dashboard/general/inspection/AnalyticsSummaryOpenCloseObservation';
import AnalyticsTrendingObservation from '@/sections/@dashboard/general/inspection/AnalyticsTrendingObservation';
import AnalyticsOpenClose from '@/sections/@dashboard/general/inspection/AnalyticsOpenClose';
import FileGeneralStorageOverview from '@/sections/@dashboard/general/file/FileGeneralStorageOverview';
import BookingBookedRoom from '@/sections/@dashboard/general/booking/BookingBookedRoom';
import AnalyticsTrainingLine from '@/sections/@dashboard/general/analytics/AnalyticsTrainingLine';
import { ProgressLoadingScreen } from '@/Components/loading-screen';

// ----------------------------------------------------------------------
const GB = 1000000000 * 24;

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

const LAST_TEN_YEARS = generateYears();

const fetchSlider = () => axiosInstance.get(route('api.dashboard.slider_images')).then(res => res.data);
const fetchTrainings = () => axiosInstance.get(route('api.dashboard.trainings')).then(res => res.data);
const fetchInspections = (year) => axiosInstance.get(route('api.dashboard.inspections', { year })).then(res => res.data);
const fetchIncidents = () => axiosInstance.get(route('api.dashboard.incidents')).then(res => res.data);

export default function GeneralHSEDasboardPage ({ user, totalTbtByYear, tbtStatistics, from, to, isLoadingTbt, isLoadingTbtStat }) {
	const [tbtData, setTbtData] = useState(null);
	const [inspectionYear, setInstpectionYear] = useState("All");
	const [startTbtDate, setStartTbtDate] = useState(from ? new Date(from) : null);
	const [endTbtDate, setEndTbtDate] = useState(to ? new Date(to) : null);
	const endTbtDateRef = useRef();

	const inspectionYearPopover = usePopover();

	const theme = useTheme();
	const isTablet = useResponsive('down', 'lg');

	const { themeStretch } = useSettingsContext();

	const [
		{ isLoading: isLoadingSlider, isError: isErrorSlider, data: sliderImages },
		{ isLoading: isLoadingTraining, data: trainings },
		{ isLoading: isLoadingInspection, data: inspections },
		{ isLoading: isLoadingIncident, data: incidents },
	] = useQueries({
		queries: [
			{ queryKey: ['slider', user.subscriber_id], queryFn: fetchSlider, refetchOnWindowFocus: false },
			{ queryKey: ['dash-trainings', { sub: user.subscriber_id }], queryFn: fetchTrainings, refetchOnWindowFocus: false },
			{ queryKey: ['dash-inspections', { sub: user.subscriber_id, year: inspectionYear }], queryFn: () => fetchInspections(inspectionYear), refetchOnWindowFocus: false },
			{ queryKey: ['dash-incidents', { sub: user.subscriber_id }], queryFn: fetchIncidents, refetchOnWindowFocus: false },
		]
	});


	useEffect(() => {
		if (totalTbtByYear && tbtStatistics && (!isLoadingTbt || !isLoadingTbtStat)) {
			const tmpTotalTbtByYear = { ...totalTbtByYear };
			const tbtAndStatistics = tbtStatistics.reduce((acc, curr) => {
				const statInTbtTotal = curr.year in tmpTotalTbtByYear;
				let months = {};
				if (statInTbtTotal) {
					curr.months.forEach(month => {
						months[month.month_code] = {
							...tmpTotalTbtByYear[curr.year][month.month_code],
							totalManpower: tmpTotalTbtByYear[curr.year][month.month_code].totalManpower + Math.round(month.manpower),
							totalManhours: tmpTotalTbtByYear[curr.year][month.month_code].totalManhours + Math.round(month.manhours),
							safeManhours: tmpTotalTbtByYear[curr.year][month.month_code].safeManhours + Math.round(month.manhours),
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
			const tbt = Object.entries(tbtAndStatistics).reduce((acc, curr) => {
				const monthsData = Object.entries(curr[1]);
				monthsData.forEach(d => d.push(curr[0]));
				acc.push(...monthsData);
				return acc;
			}, []);
			setTbtData(tbt);
		}
	}, [totalTbtByYear, tbtStatistics, isLoadingTbt, isLoadingTbtStat]);


	const handleInspectionYearChange = useCallback((newValue) => {
		inspectionYearPopover.onClose();
		setInstpectionYear(newValue);
	}, [inspectionYearPopover]);

	const handleStartTbtDateChange = (newDate) => {
		setStartTbtDate(newDate);
	}

	const handleTbtEndDateChange = (newDate) => {
		setEndTbtDate(newDate);
	}

	const handleAcceptDate = () => {
		if (fTimestamp(startTbtDate) > fTimestamp(endTbtDate)) {
			endTbtDateRef.current.click();
		} else if (startTbtDate && endTbtDate) {
			const end = new Date(endTbtDate);
			const dates = {
				from: format(startTbtDate, 'yyyy-MM-dd'),
				to: format(new Date(end.setMonth(end.getMonth() + 1, 0)), 'yyyy-MM-dd')
			}
			Inertia.get(route("dashboard"), dates, {
				preserveScroll: true,
				preserveState: true,
				only: [
					"from",
					"to",
				]
			});
		}
	}

	const { tbtAnalytic, tbtDataItd } = useMemo(() => {
		if (!tbtData || !totalTbtByYear) return { tbtAnalytic: null, tbtDataItd: null };
		return tbtData.reduce((acc, curr) => {
			const currMonth = curr[0];
			const total = tbtData.find(t => (t[0] === currMonth && t[2] === curr[2]));
			if (total) {
				acc.tbtAnalytic.totalManpower += Math.round(total[1].totalManpower);
				acc.tbtAnalytic.totalManhours += Math.round(total[1].totalManhours);
				acc.tbtAnalytic.safeManhours += total[1].totalManhours === 0 ? 0 : Math.round(total[1].safeManhours);
				acc.tbtAnalytic.daysWork += total[1].daysWork;
				acc.tbtAnalytic.daysWoWork += total[1].daysWoWork;
				acc.tbtAnalytic.location = new Set([
					...acc.tbtAnalytic.location,
					...total[1].location,
				]);
			}

			const currTotal = {
				totalManpower: acc.tbtDataItd.totalManpower,
				totalManhours: acc.tbtDataItd.totalManhours,
				daysWork: acc.tbtDataItd.daysWork,
				daysWoWork: acc.tbtDataItd.daysWoWork,
				location: new Set([...acc.tbtDataItd.location, ...curr[1].location]),
			};
			if (curr[2] in totalTbtByYear) {
				acc.tbtDataItd = calculateItd({
					monthsObj: totalTbtByYear[curr[2]],
					currMonth,
					currTotal,
				});
			} else {
				const currYear = tbtData.filter(a => a[2] === curr[2]);
				let monthsObj = {};
				currYear.forEach(d => {
					monthsObj[d[0]] = d[1];
				});
				acc.tbtDataItd = calculateItd({
					monthsObj,
					currMonth,
					currTotal,
				});
			}

			return acc;
		}, {
			tbtAnalytic: {
				totalManpower: 0,
				totalManhours: 0,
				safeManhours: 0,
				daysWork: 0,
				daysWoWork: 0,
				location: new Set(),
			},
			tbtDataItd: {
				totalManpower: 0,
				totalManhours: 0,
				daysWork: 0,
				daysWoWork: 0,
				location: new Set(),
			},
		});
	}, [tbtData]);

	const getTbtMonthChartData = () => {
		if (tbtData) {
			if (tbtData.length > 12) {
				const tbtHasData = tbtData.filter(tbt => (tbt[1].totalManhours !== 0 && tbt[1].totalManpower !== 0));
				const tbtRolling = tbtHasData.slice(tbtHasData.length - 12);
				const tbtWorks = tbtRolling.reduce((acc, curr) => ({
					daysWork: acc.daysWork + (curr[1]?.daysWork || 0),
					daysWoWork: acc.daysWoWork + (curr[1]?.daysWoWork || 0)
				}), { daysWork: 0, daysWoWork: 0 })
				return {
					tbt: tbtRolling,
					...tbtWorks,
				}
			} else {
				const tbtWorks = tbtData.reduce((acc, curr) => ({
					daysWork: acc.daysWork + (curr[1]?.daysWork || 0),
					daysWoWork: acc.daysWoWork + (curr[1]?.daysWoWork || 0)
				}), { daysWork: 0, daysWoWork: 0 });
				return {
					tbt: tbtData.filter(tbt => (tbt[1].totalManhours !== 0 && tbt[1].totalManpower !== 0)),
					...tbtWorks
				}
			}
		}
		return [];
	}

	const tbtMonthChartData = getTbtMonthChartData();
	// const monthsDiff = monthDiff(startTbtDate, endTbtDate);
	return (
		<>
			<Container maxWidth={themeStretch ? false : 'xl'}>
				<Grid container spacing={3} sx={{ mb: 3 }}>
					<Grid item xs={12} md={8}>
						<AppWelcome
							title='Health and Safety Management Software'
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
									{/* <Button variant="contained">Go Now</Button> */}
									<Typography paragraph variant="h5" sx={{ whiteSpace: 'pre-line' }}>
										{`Welcome back! \n ${user?.employee?.fullname || user?.firstname}`}
									</Typography>
								</Stack>
							}
						/>
					</Grid>

					<Grid item xs={12} md={4}>
						<HseSlider list={sliderImages} isLoading={isLoadingSlider} isError={isErrorSlider} />
					</Grid>

					<Grid item xs={12} sm={6} md={3}>
						<AnalyticsWidgetSummary
							isLoading={isLoadingTbtStat || tbtData === null}
							title="Average Manpower/Day"
							// title="Ave. MANPOWER/DAY"
							// total={monthsDiff === 1 ?
							// 	Math.round((tbtAnalytic?.totalManpower || 1) / new Date(+tbtData[0][2], +tbtData[0][0], 0).getDate())
							// 	: Math.round((tbtAnalytic?.totalManpower || 1) / (monthsDiff || 1))
							// }
							total={Math.round((tbtAnalytic?.totalManpower || 1)) / (differenceInDays(endTbtDate, startTbtDate) + 1)}
							color="info"
							// icon={'material-symbols:supervisor-account-outline'}
							icon={'ic:twotone-people-alt'}
						/>
					</Grid>

					<Grid item xs={12} sm={6} md={3}>
						<AnalyticsWidgetSummary
							isLoading={isLoadingTbtStat || tbtData === null}
							title="Total Manpower"
							// title="MANPOWER"
							total={Math.round(tbtAnalytic?.totalManpower || 0)}
							// icon={'simple-line-icons:user'}
							icon={'fluent:people-team-16-filled'}
						/>
					</Grid>

					<Grid item xs={12} sm={6} md={3}>
						<AnalyticsWidgetSummary
							isLoading={isLoadingTbtStat || tbtData === null}
							title="Total Manhours"
							// title="MANHOURS"
							total={Math.round(tbtAnalytic?.totalManhours || 0)}
							icon={'tabler:clock-hour-4'}
							// icon={'mdi:clock-time-four-outline'}
							color="warning"
						/>
					</Grid>

					<Grid item xs={12} sm={6} md={3}>
						<AnalyticsWidgetSummary
							isLoading={isLoadingTbtStat || tbtData === null}
							title="Total Safe Manhours"
							// title="SAFE MANHOURS"
							total={Math.round(tbtAnalytic?.totalManhours || 0)}
							color="error"
							// icon={'mdi:clock-time-four-outline'}
							icon={'mdi:shop-hours-outline'}
						/>
					</Grid>
				</Grid>

				<Divider variant="middle" sx={{ my: 1 }} />

				<Grid item md={12} sx={{ mb: 1 }}>
					<Box display="flex" justifyContent="end">
						<Box>
							<Typography variant="subtitle2" fontWeight={700} mb={1} textAlign="right">Filter TBT By Date</Typography>
							<Box display="flex" gap={2}>
								<MobileDatePicker
									label="Start Date"
									value={startTbtDate}
									onChange={handleStartTbtDateChange}
									onAccept={handleAcceptDate}
									inputFormat="MMM yyyy"
									openTo="year"
									showToolbar
									views={['year', 'month']}
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
									value={endTbtDate}
									onChange={handleTbtEndDateChange}
									onAccept={handleAcceptDate}
									minDate={startTbtDate}
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

				<Grid container spacing={2}>
					<Grid item xs={12} md={7} lg={5} order={{ md: 1, lg: 1 }}>
						<AnalyticsTable
							isLoading={(isLoadingTbt || tbtAnalytic === null || tbtData === null) || isLoadingTraining}
							headTitles={[{ title: "HSE Data" }, { title: "Month", align: "right" }, { title: "ITD", align: "right" }]}
							data={[
								{
									title: "Total Days Work",
									month: tbtAnalytic?.daysWork,
									itd: tbtDataItd?.daysWork,
								},
								{
									title: "Total Days w/o Work",
									month: tbtAnalytic?.daysWoWork,
									itd: tbtDataItd?.daysWoWork,
								},
								{
									title: "Total Work Location",
									month: tbtAnalytic?.location?.size,
									itd: tbtDataItd?.location?.size,
								},
								{
									title: "Number of Training Hours Completed",
									month: trainings?.totalHrsMonthCompleted || 0,
									itd: trainings?.totalHrsCompleted || 0,
								},
								{
									title: "Number of HSE Induction Completed",
									month: trainings?.totalInductionMonthCompleted || 0,
									itd: trainings?.totalInductionCompleted || 0,
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
						{(tbtData && tbtMonthChartData) ? (
							<Card>
								<Scrollbar>
									<Box sx={{ width: 980 }}>
										<AnalyticsTBTLine
											height={isTablet ? 364 : 240}
											title="Hours Worked / Month"
											subheader="(12 month rolling)"
											chart={{
												labels: tbtMonthChartData.tbt.map(d => `${MONTH_NAMES[d[0]]} ${d[2]}`),
												series: tbtMonthChartData.tbt.reduce((acc, curr) => {
													acc[0].data.push(curr[1].totalManpower);
													acc[1].data.push(curr[1].totalManhours);
													acc[2].data.push(curr[1].totalManhours === 0 ? 0 : curr[1].safeManhours);
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
									</Box>
								</Scrollbar>
							</Card>
						) : (
							<Card sx={{ p: 2 }}>
								<Skeleton animation='pulse' sx={{ mt: 1, mb: 1 }} height={28} width={200} />
								<Skeleton animation='pulse' height={24} width={120} />
								<Skeleton animation='pulse' height={320} width="100%" />
							</Card>
						)}
					</Grid>
					<Grid item xs={12} md={5} lg={2} order={{ md: 2, lg: 3 }}>
						{(tbtData && tbtMonthChartData) ? (
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
						) : (
							<Card sx={{ p: 2 }}>
								<Skeleton animation='pulse' sx={{ mt: 1, mb: 1 }} height={28} width={90} />
								<Skeleton animation='pulse' sx={{ my: 3 }} height={200} width="100%" variant="circular" />
								<Skeleton animation='pulse' sx={{ mt: 1, mb: 1 }} height={28} width="100%" />
								<Skeleton animation='pulse' sx={{ mt: 1, mb: 1 }} height={28} width="100%" />
								<Skeleton animation='pulse' sx={{ mt: 1 }} height={28} width="100%" />
							</Card>
						)}
					</Grid>
				</Grid>

				<Grid container spacing={2} sx={{ my: 2 }}>
					<AnalyticsTrainingLine />
				</Grid>


				<Divider variant="middle" sx={{ my: 3 }} />

				<Stack width={1} alignItems="flex-end" my={1} px={1}>
					<Stack alignItems="flex-end">
						<Typography variant="subtitle2" fontWeight={700} mb={1} textAlign="right">Inspection Year</Typography>
						<ButtonBase
							onClick={inspectionYearPopover.onOpen}
							sx={{
								pl: 1,
								py: 0.5,
								pr: 0.5,
								borderRadius: 1,
								typography: 'subtitle2',
								bgcolor: 'background.neutral',
								width: 90,
								justifyContent: 'space-around'
							}}
						>
							{inspectionYear}
							<Iconify
								width={16}
								icon={inspectionYearPopover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
								sx={{ ml: 0.5 }}
							/>
						</ButtonBase>
					</Stack>
				</Stack>

				<Grid container spacing={3} >
					<Grid item xs={12} md={7} lg={5} order={{ md: 1, lg: 1 }}>
						<AnalyticsTable
							isLoading={isLoadingIncident || !incidents}
							headTitles={[{ title: "Accidents and Incidents" }, { title: "Month", align: "right" }, { title: "ITD", align: "right" }]}
							data={[
								{ title: "Fatality", month: incidents?.severity?.month.Fatality, itd: incidents?.severity?.itd?.Fatality },
								{ title: "Major", month: incidents?.severity?.month.Major, itd: incidents?.severity?.itd?.Major },
								{ title: "Significant", month: incidents?.severity?.month.Significant, itd: incidents?.severity?.itd?.Significant },
								{ title: "Minor", month: incidents?.severity?.month.Minor, itd: incidents?.severity?.itd?.Minor },
								{ title: "Number of Near Miss Reports Received", month: 0, itd: 0 },
								{ title: "Total Recordable Injuries (TRIs)", month: 0, itd: 0 },
								{ title: "Lost Time Injury Frequency Rate (LTIFR)", month: incidents?.ltifr?.month, itd: incidents?.ltifr?.itd },
								{ title: "Lost Time Injury Severity Rate (LTISR)", month: incidents?.ltisr?.month, itd: incidents?.ltisr?.itd },
								{ title: "Total Reportable Case Frequency (TRCF)", month: incidents?.trcf?.month, itd: incidents?.trcf?.itd },
								{ title: "Fatal Accident Frequency Rate (FAFR)", month: incidents?.fafr?.month, itd: incidents?.fafr?.itd },
							]}
							color="error"
						/>
					</Grid>

					{/* Summary Open vs Close Observation */}
					<Grid item xs={12} md={12} lg={5} order={{ md: 3, lg: 2 }}>
						<Card sx={{ height: 400 }}>
							{isLoadingInspection || !inspections ? (
								<>
									<CardHeader title="Summary Open vs Close Observation" />
									<ProgressLoadingScreen color={theme.palette.primary.main} height={400 - 52} />
								</>
							) : (
								<Scrollbar>
									<AnalyticsSummaryOpenCloseObservation
										height={900}
										title="Summary Open vs Close Observation"
										chart={{
											categories: inspections?.summary?.categories || [],
											series: inspections?.summary?.series || [],
											colors: [theme.palette.success.main, theme.palette.info.main]
										}}
									/>
								</Scrollbar>
							)}
						</Card>
					</Grid>

					{/* Open vs Close */}
					<Grid item xs={12} md={5} lg={2} order={{ md: 2, lg: 3 }}>
						{isLoadingInspection || !inspections ? (
							<Card>
								<CardHeader title="Open vs Close" />
								<ProgressLoadingScreen color={theme.palette.primary.main} height={400 - 52} />
							</Card>
						) : (
							<AnalyticsOpenClose
								title="Open vs Close"
								height={160}
								type="donut"
								chart={{
									series: [
										{ label: 'Open', value: inspections?.openVsClose?.open || 0 },
										{ label: 'Close', value: inspections?.openVsClose?.close || 0 },
									],
									colors: [
										theme.palette.info.main,
										theme.palette.success.main,
									],
								}}
								sx={{ height: "100%" }}
							/>
						)}
					</Grid>
				</Grid>

				<Divider variant="middle" sx={{ my: 3 }} />

				<Grid container spacing={3} >
					{/* Trending Observation */}
					<Grid item xs={12} md={12} lg={12}>
						{isLoadingInspection || !inspections ? (
							<Card>
								<CardHeader title="Trending Observation" />
								<ProgressLoadingScreen color={theme.palette.primary.main} height={280} />
							</Card>
						) : (
							<Card>
								<Scrollbar>
									<Box sx={{ width: 1800 }}>
										<AnalyticsTrendingObservation
											height={280}
											title="Trending Observation"
											trends={inspections?.trendingObservation?.trends}
											chart={{
												categories: inspections?.trendingObservation?.categories || [],
												series: inspections?.trendingObservation?.series || [],
											}}
										/>
									</Box>
								</Scrollbar>
							</Card>
						)}
					</Grid>
				</Grid>

				<Divider variant="middle" sx={{ my: 3 }} />

				{(incidents) && (
					<>
						<Grid container spacing={3} >
							<Grid item xs={12} md={12} lg={6}>
								<Stack spacing={2}>
									<AnalyticsTable
										isLoading={isLoadingIncident || !incidents}
										headTitles={[{ title: "Recordable Cases" }, { title: "Month", align: "right" }, { title: "ITD", align: "right" }]}
										data={[
											{ title: "No of Restricted Work Cases", month: incidents?.recordable?.rwc.month, itd: incidents?.recordable?.rwc.itd },
											{ title: "No of Occupational Illnesses", month: incidents?.recordable?.ol.month, itd: incidents?.recordable?.ol.itd, },
											{ title: "No of Occupational Fatalities", month: incidents?.recordable?.fat.month, itd: incidents?.recordable?.fat.itd },
											{ title: "No of Medical Treatment Cases", month: incidents?.recordable?.mtc.month, itd: incidents?.recordable?.mtc.itd },
											{ title: "No of Loss Consciousness Cases", month: incidents?.recordable?.lcc.month, itd: incidents?.recordable?.lcc.itd },
										]}
										color="warning"
									/>
									<Divider />
									<AnalyticsTable
										isLoading={isLoadingIncident || !incidents}
										headTitles={[{ title: "Non Recordable" }, { title: "Month", align: "right" }, { title: "ITD", align: "right" }]}
										data={[
											{ title: "No of First Aid Cases", month: incidents?.nonrecordable?.fac.month, itd: incidents?.nonrecordable?.fac.itd },
											{ title: "No of Near Misses", month: incidents?.nonrecordable?.nm.month, itd: incidents?.nonrecordable?.nm.itd }
										]}
									/>
								</Stack>
							</Grid>
							<Grid item xs={12} md={12} lg={6} height={1}>
								<Stack spacing={2} height={1}>
									{incidents && (
										<AnalyticsTable
											isLoading={isLoadingIncident}
											headTitles={[{ title: "Other Incidents" }, { title: "Month", align: "right" }, { title: "ITD", align: "right" }]}
											data={[
												{ title: "No of Property Damage", month: incidents?.pd.month, itd: incidents?.pd.itd },
												{ title: "No of Spill & Leaks", month: 0, itd: 0 },
												{ title: "No of Other Environ. incidents", month: incidents?.env.month, itd: incidents?.env.itd },
												{ title: "No of Fires", month: incidents?.fire.month, itd: incidents?.fire.itd },
												{ title: "No of Vehicle Accidents", month: incidents?.traf.month, itd: incidents?.traf.itd },
											]}
											color="error"
											sx={{ mb: 1 }}
										/>
									)}
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

							{/* <Grid item xs={12} md={6} lg={3}>
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
								<BookingBookedRoom title="Analytic" data={_bookingsOverview} />
							</Grid> */}
						</Grid>


						<Divider variant="middle" sx={{ my: 3 }} />
					</>
				)}

			</Container>
			<CustomPopover open={inspectionYearPopover.open} onClose={inspectionYearPopover.onClose} sx={{ width: 140 }}>
				<MenuItem
					selected={"All" === inspectionYear}
					onClick={() => handleInspectionYearChange("All")}
				>
					All
				</MenuItem>
				{LAST_TEN_YEARS.map((option) => (
					<MenuItem
						key={option}
						selected={option === inspectionYear}
						onClick={() => handleInspectionYearChange(option)}
					>
						{option}
					</MenuItem>
				))}
			</CustomPopover>
		</>
	);
}

function calculateItd ({ monthsObj, currMonth, currTotal }) {
	const prevMonth = +currMonth - 1;
	if (prevMonth in monthsObj) {
		const month = monthsObj[prevMonth];
		const total = {
			totalManpower: currTotal.totalManpower + Math.round(month.totalManpower),
			totalManhours: currTotal.totalManhours + Math.round(month.totalManhours),
			daysWork: currTotal.daysWork + month.daysWork,
			daysWoWork: currTotal.daysWoWork + month.daysWoWork,
			location: new Set([...currTotal.location, ...month.location])
		};
		return calculateItd({ monthsObj, currMonth: prevMonth, currTotal: total });
	} else {
		return currTotal;
	}
}

// function monthDiff (dateFrom, dateTo) {
// 	if (dateFrom && dateTo) {
// 		return dateTo.getMonth() - dateFrom.getMonth() +
// 			(12 * (dateTo.getFullYear() - dateFrom.getFullYear())) + 1
// 	}
// }