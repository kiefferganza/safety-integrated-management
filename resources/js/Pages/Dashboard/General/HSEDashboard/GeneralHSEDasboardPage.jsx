import { useState, lazy, useCallback } from 'react';
import { endOfMonth, format, startOfMonth} from 'date-fns';
// @mui
const { Box, Grid, Container, Button, Typography, Stack, Divider, useTheme } = await import('@mui/material');
// _mock_
import { _bookingsOverview } from '@/_mock/arrays';
// utils
import { generateYears } from '@/utils/years';
// components
import { useSettingsContext } from '@/Components/settings';
import CustomPopover, { usePopover } from '@/Components/custom-popover';
import useResponsive from '@/hooks/useResponsive';
import Iconify from '@/Components/iconify';
import { Inertia } from '@inertiajs/inertia';
import { useDateRangePicker } from "@/Components/date-range-picker";
import DateRangePicker from "@/Components/date-range-picker/DateRangePicker";
// sections
// import LoadingScreen from '@/Components/loading-screen/LoadingScreen';
import Scrollbar from '@/Components/scrollbar/Scrollbar';
import { useQueries } from '@tanstack/react-query';
import axiosInstance from '@/utils/axios';
import { ButtonBase, Card, CardHeader, MenuItem, Skeleton, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip } from '@mui/material';
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
// import FileGeneralStorageOverview from '@/sections/@dashboard/general/file/FileGeneralStorageOverview';
// import BookingBookedRoom from '@/sections/@dashboard/general/booking/BookingBookedRoom';
import AnalyticsTrainingLine from '@/sections/@dashboard/general/analytics/AnalyticsTrainingLine';
import { ProgressLoadingScreen } from '@/Components/loading-screen';

// ----------------------------------------------------------------------
// const GB = 1000000000 * 24;

const CURRENT_DATE = new Date();
const CURRENT_YEAR = CURRENT_DATE.getFullYear();
const CURRENT_MONTH = CURRENT_DATE.getMonth();

const LAST_TEN_YEARS = generateYears();

const fetchSlider = () => axiosInstance.get(route('api.dashboard.slider_images')).then(res => res.data);
const fetchTrainings = () => axiosInstance.get(route('api.dashboard.trainings')).then(res => res.data);
const fetchInspections = (year) => axiosInstance.get(route('api.dashboard.inspections', { year })).then(res => res.data);
const fetchIncidents = () => axiosInstance.get(route('api.dashboard.incidents')).then(res => res.data);

export default function GeneralHSEDasboardPage ({ user, tbt, from, to, isLoadingTbt }) {
	const [inspectionYear, setInstpectionYear] = useState("All");

  const {
		startDate,
		endDate,
		open: openPicker,
		onOpen: onOpenPicker,
		onClose: onClosePicker,
		isSelected: isSelectedValuePicker,
		isError,
		label,
		setStartDate,
		setEndDate
	} = useDateRangePicker(new Date(from), new Date(to));

  const handleStartDateChange = (date) => {
		setStartDate(startOfMonth(date));
	}

	const handleEndDateChange = (date) => {
		setEndDate(endOfMonth(date));
	}

  const handleOnFilterDate = () => {
    const dates = {
      from: format(startDate, 'yyyy-MM-dd'),
      to: format(endDate, 'yyyy-MM-dd')
    }
    Inertia.get(route("dashboard"), dates, {
      preserveScroll: true,
      preserveState: true,
      only: [
        "from",
        "to",
      ],
      onStart() {
        onClosePicker();
      }
    });
	}

  const handleClosePicker = () => {
		setStartDate(new Date(from));
		setEndDate(new Date(to));
		onClosePicker();
	}

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

	const handleInspectionYearChange = useCallback((newValue) => {
		inspectionYearPopover.onClose();
		setInstpectionYear(newValue);
	}, [inspectionYearPopover]);

  const currentDateTbt = tbt?.tbtByYear?.[CURRENT_YEAR]?.[CURRENT_MONTH];
  console.log(tbt);
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


          {/* ANALYTICS */}
          <Grid item xs={12}>
            <Stack flexDirection="row" gap={3} flexWrap="wrap">
              <AnalyticsWidgetSummary
                isLoading={isLoadingTbt}
                title="Average Manpower/Day"
                total={tbt?.analytics.avg_manpower_day || 0}
                color="info"
                icon={'ic:twotone-people-alt'}
              />

              <AnalyticsWidgetSummary
                isLoading={isLoadingTbt}
                title="Total Manpower"
                total={tbt?.analytics.totalManpower || 0}
                icon={'fluent:people-team-16-filled'}
              />

              <AnalyticsWidgetSummary
                isLoading={isLoadingTbt}
                title="Total Manhours"
                total={tbt?.analytics.totalManHours || 0}
                icon={'tabler:clock-hour-4'}
                color="warning"
              />

            <AnalyticsWidgetSummary
							isLoading={isLoadingTbt}
							title="Total Safe Manhours"
							total={tbt?.smh || 0}
							color="error"
							icon={'mdi:shop-hours-outline'}
						/>
            </Stack>
          </Grid>
				</Grid>

				<Divider variant="middle" sx={{ my: 1 }} />

				<Grid item md={12} sx={{ mb: 1 }}>
					<Box display="flex" justifyContent="end">
						<Box>
							<Typography variant="subtitle2" fontWeight={700} mb={1} textAlign="right">Filter TBT By Date</Typography>
							<Box display="flex" mb={1}>
                {isSelectedValuePicker ? (
                  <Button
                    onClick={onOpenPicker}
                    variant="outlined"
                  >
                    {label}
                  </Button>
                ) : (
                  <Tooltip title="Filter Toolbox Talk">
                    <IconButton size="small" onClick={onOpenPicker}>
                      <Iconify icon="eva:calendar-fill" />
                    </IconButton>
                  </Tooltip>
                )}
							</Box>
						</Box>
					</Box>
				</Grid>

				<Grid container spacing={2}>
					<Grid item xs={12} md={7} lg={5} order={{ md: 1, lg: 1 }}>
						<AnalyticsTable
							isLoading={isLoadingTbt || isLoadingTraining}
							headTitles={[{ title: "HSE Data" }, { title: "Month", align: "right" }, { title: "ITD", align: "right" }]}
							data={[
								{
									title: "Total Days Work",
									month: currentDateTbt?.totalManpower ? currentDateTbt.days.length : 0,
									itd: tbt?.analytics.daysWork || 0,
								},
								{
									title: "Total Days w/o Work",
									month: currentDateTbt?.totalManpower ? currentDateTbt.totalDays - currentDateTbt.days.length : 0,
									itd: tbt?.analytics.daysWoWork || 0,
								},
								{
									title: "Total Work Location",
									month: currentDateTbt?.totalManpower ? currentDateTbt.location.length : 0,
									itd: tbt?.analytics.location || 0,
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
						{(!isLoadingTbt && tbt) ? (
              <Card sx={{ height: '100%' }}>
                  <Scrollbar>
                      <Box sx={{ width: '100%', minWidth: 800 }}>
                        <AnalyticsTBTLine
                          height={isTablet ? 364 : 240}
                          title="Manpower / Month"
                          subheader="(12 month rolling)"
                          chart={{
                            categories: tbt?.monthRolling.categories || [],
                            series: tbt?.monthRolling.manpower ? [{
                              data: Object.values(tbt.monthRolling.manpower),
                              name: 'Manpower'
                            }] : [],
                            colors: [theme.palette.primary.main],
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
						{(!isLoadingTbt) ? (
							<AnalyticsTBTWorkDays
								title="Work Days"
								chart={{
									series: [
										{ label: 'Days Work', value: tbt?.analytics.daysWork },
										{ label: 'Days Without Work', value: tbt?.analytics.daysWoWork },
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

				<Grid container spacing={2} mt={1}>
					<Grid item xs={12} md={12} lg={6} order={{ md: 3, lg: 2 }}>
						{(!isLoadingTbt) ? (
							<Card sx={{ height: '100%' }}>
									<Box>
										<AnalyticsTBTLine
											height={isTablet ? 364 : 240}
											title="Hours Worked / Month"
											subheader="(12 month rolling)"
											chart={{
                        categories: tbt?.monthRolling.categories || [],
                        series: tbt?.monthRolling.manhours ? [{
                          data: Object.values(tbt.monthRolling.manhours),
                          name: 'Manhour'
                        }] : [],
												colors: [theme.palette.info.main],
											}}
										/>
									</Box>
							</Card>
						) : (
							<Card sx={{ paddingX: 2 }}>
								<Skeleton animation='pulse' sx={{ mt: 1.5, mb: 0.5 }} height={32} width={200} />
								<Skeleton animation='pulse' height={24} width={120} />
								<Skeleton animation='pulse' height={320} width="100%" />
							</Card>
						)}
					</Grid>

					<Grid item xs={12} md={12} lg={6} order={{ md: 2, lg: 3 }}>
						{(!isLoadingTbt) ? (
							<Card sx={{ height: '100%' }}>
                <Box>
                  <AnalyticsTBTLine
                    height={isTablet ? 364 : 240}
                    title="Safe Manhour / Month"
                    subheader="(12 month rolling)"
                    chart={{
                      categories: tbt?.monthRolling.categories || [],
                      series: tbt?.monthRolling.safemanhours ? [{
                        data: Object.values(tbt.monthRolling.safemanhours),
                        name: 'Safe Manhour'
                      }] : [],
                      colors: [theme.palette.error.main],
                    }}
                  />
                </Box>
            </Card>
						) : (
							<Card sx={{ paddingX: 2 }}>
								<Skeleton animation='pulse' sx={{ mt: 1.5, mb: 0.5 }} height={32} width={200} />
								<Skeleton animation='pulse' height={24} width={120} />
								<Skeleton animation='pulse' height={320} width="100%" />
							</Card>
						)}
					</Grid>
				</Grid>

        <Divider variant="middle" sx={{ my: 3 }} />

				<Grid container spacing={2}>
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
						<Card sx={{ height: '100%', maxHeight: 600 }}>
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
					<Grid item xs={12} md={12} lg={9}>
						{isLoadingInspection || !inspections ? (
							<Card>
								<CardHeader title="Trending Observation" />
								<ProgressLoadingScreen color={theme.palette.primary.main} height={460} />
							</Card>
						) : (
							<AnalyticsTrendingObservation
								height={420}
								title="Trending Observation"
								trends={inspections?.trendingObservation?.trends}
								chart={{
									categories: inspections?.trendingObservation?.categories || [],
									series: inspections?.trendingObservation?.series || [],
								}}
							/>
						)}
					</Grid>
					<Grid item xs={12} md={12} lg={3}>
						<Card sx={{ height: '100%' }}>
							<CardHeader title="Top 5 HSE Hazards (Month)" sx={{ mb: 1.5 }} />
							<Scrollbar>
                <TableContainer sx={{ overflow: 'unset', height: 'calc(100% - 68px)' }}>
                  <Table>
                    <TableBody>
                      {inspections?.trendingObservation?.trends.map((trend, idx) => (
                        <TableRow key={trend.name}>
                          <TableCell>
                            <Typography variant="subtitle2">{idx + 1}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2">{trend.name}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2" color="error.dark" sx={{ textDecoration: 'underline' }}>{trend.value}</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>
						</Card>
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
      <DateRangePicker
				variant="calendar"
				title="Choose Toolbox Talk date"
				startDate={startDate}
				endDate={endDate}
				onChangeStartDate={handleStartDateChange}
				onChangeEndDate={handleEndDateChange}
				open={openPicker}
				onClose={handleClosePicker}
				isSelected={isSelectedValuePicker}
				isError={isError}
				onApply={handleOnFilterDate}
				StartDateProps={{
					views: ['year', 'month'],
					openTo: "year"
				}}
				EndDateProps={{
					views: ['year', 'month'],
					openTo: "year"
				}}
			/>
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