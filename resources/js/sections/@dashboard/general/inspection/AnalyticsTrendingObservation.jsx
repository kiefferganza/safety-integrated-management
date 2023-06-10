import PropTypes from 'prop-types';
// @mui
import { Box, Card, CardHeader } from '@mui/material';
import { red } from '@mui/material/colors';
// components
import Chart, { useChart } from '@/Components/chart';
import { ellipsis } from '@/utils/exercpt';

// ----------------------------------------------------------------------

const AnalyticsTrendingObservation = ({ title, subheader, chart, height, width, maxNegative, ...other }) => {
	const { series, categories, options } = chart;

	const chartOptions = useChart({
		colors: [function ({ value }) {
			const percentage = (value / maxNegative) * 100;
			if (percentage > 50) {
				return red[700];
			} else if (percentage < 50) {
				return red[300];
			}
			return red[500];
		}],
		series,
		plotOptions: {
			bar: {
				columnWidth: '65%',
			},
		},
		xaxis: {
			categories,
			title: {
				text: undefined
			},
		},
		states: {
			hover: {
				filter: 'none'
			}
		},
		dataLabels: {
			enabled: true,
			formatter: function (val, opts) {
				if (opts.seriesIndex === undefined) {
					return val; // Handle tooltip label
				} else {
					return ellipsis(val); // Handle data label with ellipsis
				}
			},
			style: {
				rotate: 0
			}
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

			<Box sx={{ mx: 3 }} dir="ltr">
				<Chart type="bar" series={series} options={chartOptions} height={height} width={width} />
			</Box>
		</Card>
	);
}

export default AnalyticsTrendingObservation;

AnalyticsTrendingObservation.propTypes = {
	chart: PropTypes.object,
	title: PropTypes.string,
	subheader: PropTypes.string,
};