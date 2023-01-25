import { useEffect, useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Button, TextField } from '@mui/material';
// _mock_
import { _analyticPost, _analyticOrderTimeline, _analyticTraffic, _ecommerceNewProducts } from '@/_mock/arrays';
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


export default function GeneralAnalyticsPage ({ user, items, totalTbtByYear }) {
	const [tbtYearSelected, setTbtYearSelected] = useState(null);
	const [tbtWorkMonthSelected, setTbtWorkMonthSelected] = useState("1");
	const { totalMainContractors, totalSubContractors, tbt, trainingHours,
		itds: { count, itdMonth, totalHoursByMonth, totalItd, totalParticipantsPerMonth, totalDays, itdsManual } } = items;

	const theme = useTheme();

	const { themeStretch } = useSettingsContext();

	useEffect(() => {
		if (totalTbtByYear) {
			setTbtYearSelected(Object.keys(totalTbtByYear).at(0));
		}
	}, [totalTbtByYear]);

	const tbtSelectedYear = tbtYearSelected ? totalTbtByYear[tbtYearSelected] : false;

	const tbtMpMhSmh = tbtSelectedYear ? Object.values(tbtSelectedYear).reduce((acc, curr) => {
		acc.mp.push(curr.totalManpower);
		acc.mh.push(curr.totalManhours);
		acc.smh.push(curr.safeManhours);
		return acc;
	}, { mp: [], mh: [], smh: [] }) : { mp: [], mh: [], smh: [] };

	const tbtMonth = tbtSelectedYear ? tbtSelectedYear[tbtWorkMonthSelected] : {};

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

				<Grid item xs={12} sm={6} md={3}>
					<AnalyticsWidgetSummary
						title="MANHOURS WORKED"
						total={0}
						data={[
							{
								label: "This Month",
								total: totalHoursByMonth
							},
							{
								label: "ITD",
								total: (totalItd + itdsManual)
							}
						]}
						icon={'mdi:clock-time-four-outline'}
					/>
				</Grid>

				<Grid item xs={12} sm={6} md={3}>
					<AnalyticsWidgetSummary
						title="MANPOWER"
						total={0}
						data={[
							{
								label: "Contractor",
								total: totalMainContractors
							},
							{
								label: "Subcontractor",
								total: totalSubContractors
							}
						]}
						color="info"
						icon={'simple-line-icons:user'}
					/>
				</Grid>

				<Grid item xs={12} sm={6} md={3}>
					<AnalyticsWidgetSummary
						title="HSE TRAINING HOURS"
						total={0}
						data={[
							{
								label: "This Month",
								total: trainingHours.thisMonth
							},
							{
								label: "ITD",
								total: trainingHours.itd
							}
						]}
						color="warning"
						icon={'mdi:clock-time-four-outline'}
					/>
				</Grid>

				<Grid item xs={12} sm={6} md={3}>
					<AnalyticsWidgetSummary
						title="TOOLBOX TALK"
						total={0}
						data={[
							{
								label: "This Month",
								total: tbt.thisMonth
							},
							{
								label: "ITD",
								total: tbt.itd
							}
						]}
						color="error"
						icon={'mdi:dropbox'}
					/>
				</Grid>

				<Grid item xs={12} md={6} lg={8}>
					<AnalyticsTBTLine
						title="Monthly Toolbox Talk"
						chart={{
							labels: [
								`Jan ${tbtYearSelected}`,
								`Feb ${tbtYearSelected}`,
								`Mar ${tbtYearSelected}`,
								`Apr ${tbtYearSelected}`,
								`May ${tbtYearSelected}`,
								`Jun ${tbtYearSelected}`,
								`Jul ${tbtYearSelected}`,
								`Aug ${tbtYearSelected}`,
								`Sep ${tbtYearSelected}`,
								`Oct ${tbtYearSelected}`,
								`Nov ${tbtYearSelected}`,
								`Dec ${tbtYearSelected}`,
							],
							series: [
								{
									name: 'Manpower',
									type: 'column',
									fill: 'solid',
									data: tbtMpMhSmh.mp,
								},
								{
									name: 'Man Hours',
									type: 'column',
									fill: 'solid',
									data: tbtMpMhSmh.mh,
								},
								{
									name: 'Safe Man Hours',
									type: 'column',
									fill: 'solid',
									data: tbtMpMhSmh.smh,
								}
							],
							colors: [
								theme.palette.primary.main,
								theme.palette.error.main,
							],
						}}
						action={
							<TextField
								select
								fullWidth
								SelectProps={{ native: true }}
								label="Year"
								sx={{ minWidth: 90 }}
								size="small"
								value={tbtYearSelected}
								onChange={(event) => {
									setTbtYearSelected(event.target.value);
								}}
							>
								{Object.keys(totalTbtByYear).map(yr => <option key={yr} value={yr}>{yr}</option>)}
							</TextField>
						}

					/>
				</Grid>

				<Grid item xs={12} md={6} lg={4}>
					<AnalyticsTBTWorkDays
						title="Work Days"
						chart={{
							series: [
								{ label: 'Days Work', value: tbtMonth?.daysWork || 0 },
								{ label: 'Days Without Work', value: tbtMonth?.daysWoWork || 0 },
							],
							colors: [
								theme.palette.primary.main,
								theme.palette.error.main,
							],
						}}
						action={
							<TextField
								select
								fullWidth
								SelectProps={{ native: true }}
								label="Year"
								sx={{ minWidth: 90 }}
								size="small"
								value={tbtWorkMonthSelected}
								onChange={(event) => {
									setTbtWorkMonthSelected(event.target.value);
								}}
							>
								<option value="1">January</option>
								<option value="2">February</option>
								<option value="3">March</option>
								<option value="4">April</option>
								<option value="5">May</option>
								<option value="6">June</option>
								<option value="7">July</option>
								<option value="8">August</option>
								<option value="9">September</option>
								<option value="10">October</option>
								<option value="11">November</option>
								<option value="12">December</option>
							</TextField>
						}
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
