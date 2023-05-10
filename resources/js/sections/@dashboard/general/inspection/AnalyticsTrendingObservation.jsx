import PropTypes from 'prop-types';
// @mui
import { Box, Card, CardHeader } from '@mui/material';
import { red } from '@mui/material/colors';
// utils
import { fNumber } from '@/utils/formatNumber';
// components
import Chart, { useChart } from '@/Components/chart';

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
		tooltip: {
			shared: false,
			y: {
				formatter: (value) => fNumber(value),
				title: {
					formatter: (val) => val,
				},
			},
		},
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
			labels: {
				show: false,
				// align: "left",
				// // maxWidth: 20,
				// rotate: 0,
				// formatter: function (value) {
				// 	return excerpt(value, 12);
				// }
			}
		},
		tooltip: {
			x: {
				show: true,
				// formatter: undefined,
				title: {
					formatter: (seriesName) => seriesName,
				},
			},
		},
		states: {
			hover: {
				filter: 'none'
			}
		},
		dataLabels: {
			enabled: true
		},
		// yaxis: {
		// 	title: {
		// 		text: undefined
		// 	},
		// 	labels: {
		// 		show: true,
		// 		align: "left",
		// 		maxWidth: 20
		// 	}
		// },
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