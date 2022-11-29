
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
import { MotivationIllustration } from '@/assets/illustrations';
import { EcommerceNewProducts } from '@/sections/@dashboard/general/e-commerce';
import WelcomeIllustration from '@/assets/illustrations/WelcomeIllustration';

// ----------------------------------------------------------------------

export default function GeneralAnalyticsPage ({ user }) {
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
					<EcommerceNewProducts list={_ecommerceNewProducts} />
				</Grid>

				<Grid item xs={12} sm={6} md={3}>
					<AnalyticsWidgetSummary
						title="Weekly Sales"
						total={714000}
						icon={'ant-design:android-filled'}
					/>
				</Grid>

				<Grid item xs={12} sm={6} md={3}>
					<AnalyticsWidgetSummary
						title="New Users"
						total={1352831}
						color="info"
						icon={'ant-design:apple-filled'}
					/>
				</Grid>

				<Grid item xs={12} sm={6} md={3}>
					<AnalyticsWidgetSummary
						title="Item Orders"
						total={1723315}
						color="warning"
						icon={'ant-design:windows-filled'}
					/>
				</Grid>

				<Grid item xs={12} sm={6} md={3}>
					<AnalyticsWidgetSummary
						title="Bug Reports"
						total={234}
						color="error"
						icon={'ant-design:bug-filled'}
					/>
				</Grid>

				<Grid item xs={12} md={6} lg={8}>
					<AnalyticsWebsiteVisits
						title="Website Visits"
						subheader="(+43%) than last year"
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
						title="Current Visits"
						chart={{
							series: [
								{ label: 'America', value: 4344 },
								{ label: 'Asia', value: 5435 },
								{ label: 'Europe', value: 1443 },
								{ label: 'Africa', value: 4443 },
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
								{ label: 'Italy', value: 400 },
								{ label: 'Japan', value: 430 },
								{ label: 'China', value: 448 },
								{ label: 'Canada', value: 470 },
								{ label: 'France', value: 540 },
								{ label: 'Germany', value: 580 },
								{ label: 'South Korea', value: 690 },
								{ label: 'Netherlands', value: 1100 },
								{ label: 'United States', value: 1200 },
								{ label: 'United Kingdom', value: 1380 },
							],
						}}
					/>
				</Grid>

				<Grid item xs={12} md={6} lg={4}>
					<AnalyticsCurrentSubject
						title="Current Subject"
						chart={{
							categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
							series: [
								{ name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
								{ name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
								{ name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
							],
						}}
					/>
				</Grid>

				<Grid item xs={12} md={6} lg={8}>
					<AnalyticsNewsUpdate title="News Update" list={_analyticPost} />
				</Grid>

				<Grid item xs={12} md={6} lg={4}>
					<AnalyticsOrderTimeline title="Order Timeline" list={_analyticOrderTimeline} />
				</Grid>

				<Grid item xs={12} md={6} lg={4}>
					<AnalyticsTrafficBySite title="Traffic by Site" list={_analyticTraffic} />
				</Grid>

				<Grid item xs={12} md={6} lg={8}>
					<AnalyticsTasks
						title="Tasks"
						list={[
							{ id: '1', label: 'Create FireStone Logo' },
							{ id: '2', label: 'Add SCSS and JS files if required' },
							{ id: '3', label: 'Stakeholder Meeting' },
							{ id: '4', label: 'Scoping & Estimations' },
							{ id: '5', label: 'Sprint Showcase' },
						]}
					/>
				</Grid>
			</Grid>
		</Container>
	);
}
