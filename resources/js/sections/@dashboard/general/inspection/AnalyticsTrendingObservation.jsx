import PropTypes from 'prop-types';
// @mui
import { Box, Card, CardHeader, Stack, Typography, useTheme } from '@mui/material';
import { red } from '@mui/material/colors';
// components
import Chart, { useChart } from '@/Components/chart';

// ----------------------------------------------------------------------

const AnalyticsTrendingObservation = ({ title, subheader, chart, height, width, trends, ...other }) => {
	const { series, categories, options } = chart;
	const theme = useTheme();

	const chartOptions = useChart({
		colors: [function ({ value }) {
			const isTrend = trends.some(t => t.value === value);
			return isTrend ? red[900] : red[400];
		}],
		series,
		plotOptions: {
			bar: {
				columnWidth: '80%',
			},
		},
		xaxis: {
			categories,
			labels: {
				trim: true, // Enable label trimming
				maxWidth: 16, // Set the maximum width for labels
				maxHeight: 80,
				show: true,
				rotate: -75,
				style: {
					fontSize: '10px',
				}
			},
		},
		tooltip: {
			enabled: true,
			y: {
				formatter: function (val) {
					return val; // Display the full value on the tooltip
				},
			},
		},
		states: {
			hover: {
				filter: 'none'
			}
		},
		dataLabels: {
			enabled: true,
			style: {
				fontSize: '8px', // Customize the font size of data labels
			},
			value: true, // Display data labels for 0 values
		},
		legend: {
			showForZeroSeries: true
		},
		chart: {
			stacked: true,
			dropShadow: {
				enabled: true,
				blur: 1,
				opacity: 0.25,
			}
		},
		...options,
	});

	return (
		<Card {...other}>
			<CardHeader title={title} subheader={subheader} />
			<Stack direction="row" alignItems="center" flexWrap="wrap" pl={3} gap={0.5}>
				{trends.map(trend => (
					<Stack direction="row" alignItems="center" key={trend.name}>
						<Typography
							variant="subtitle2"
							sx={{
								"&:before": {
									content: '"•"',
									marginRight: .5,
									color: theme.palette.error.main
								}
							}}
						>
							{trend.name}
						</Typography>
					</Stack>
				))}
			</Stack>
			<Box sx={{ mx: 3 }} dir="ltr">
				<Chart type="bar" series={series} options={chartOptions} height={height} width={width} />
			</Box>
		</Card >
	);
}

export default AnalyticsTrendingObservation;

AnalyticsTrendingObservation.propTypes = {
	chart: PropTypes.object,
	title: PropTypes.string,
	subheader: PropTypes.string,
};