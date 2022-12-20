
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Button } from '@mui/material';
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
} from '../../../../sections/@dashboard/general/analytics';
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


export default function GeneralAnalyticsPage ({ user, data }) {
	const { mainContractors, manHoursWorks, trainingHours, tbt } = data
	const theme = useTheme();

	const { themeStretch } = useSettingsContext();

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
						total={manHoursWorks}
						icon={'mdi:clock-time-four-outline'}
					/>
				</Grid>

				<Grid item xs={12} sm={6} md={3}>
					<AnalyticsWidgetSummary
						title="MANPOWER"
						total={mainContractors}
						color="info"
						icon={'simple-line-icons:user'}
					/>
				</Grid>

				<Grid item xs={12} sm={6} md={3}>
					<AnalyticsWidgetSummary
						title="HSE TRAINING HOURS"
						total={trainingHours}
						color="warning"
						icon={'mdi:clock-time-four-outline'}
					/>
				</Grid>

				<Grid item xs={12} sm={6} md={3}>
					<AnalyticsWidgetSummary
						title="TOOLBOX TALK"
						total={tbt}
						color="error"
						icon={'mdi:dropbox'}
					/>
				</Grid>

				<Grid item xs={12} md={6} lg={8}>
					<AnalyticsWebsiteVisits
						title=""
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
						title=""
						chart={{
							series: [
								{ label: '', value: 4344 },
								{ label: '', value: 5435 },
								{ label: '', value: 1443 },
								{ label: '', value: 4443 },
							],
							colors: [
								theme.palette.primary.main,
								theme.palette.info.main,
								theme.palette.error.main,
								theme.palette.warning.main,
							],
						}}
					/>
				</Grid>

				<Grid item xs={12} md={6} lg={8}>
					<AnalyticsConversionRates
						title="Conversion Rates"
						subheader="(+43%) than last year"
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
						title="Current Subject"
						chart={{
							categories: ['', '', '', '', '', ''],
							series: [
								{ name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
								{ name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
								{ name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
							],
						}}
					/>
				</Grid>

				<Grid item xs={12} md={6} lg={8}>
					<AnalyticsNewsUpdate title="News Update" list={[]} />
				</Grid>

				<Grid item xs={12} md={6} lg={4}>
					<AnalyticsOrderTimeline title="Order Timeline" list={[]} />
				</Grid>

				<Grid item xs={12} md={6} lg={4}>
					<AnalyticsTrafficBySite title="Traffic by Site" list={[]} />
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
