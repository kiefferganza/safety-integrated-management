import PropTypes from 'prop-types';
// @mui
import { Box, Card, CardHeader } from '@mui/material';
// utils
import { fNumber } from '@/utils/formatNumber';
// components
import Chart, { useChart } from '@/Components/chart';

// ----------------------------------------------------------------------

const AnalyticsSummaryOpenCloseObservation = ({ title, subheader, chart, height, ...other }) => {
	const { colors, series, categories, options } = chart;

	const chartOptions = useChart({
		colors,
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
				horizontal: true,
				barHeight: '48%',
				borderRadius: 2,
				stacked: true,
				stackType: '100%'
			},
		},
		xaxis: {
			categories
		},
		states: {
			hover: {
				filter: 'none'
			}
		},
		dataLabels: {
			enabled: true
		},
		yaxis: {
			title: {
				text: undefined
			},
			labels: {
				show: true,
				align: "left",
				maxWidth: 120
			}
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
				<Chart type="bar" series={series} options={chartOptions} height={height} />
			</Box>
		</Card>
	);
}

export default AnalyticsSummaryOpenCloseObservation;

AnalyticsSummaryOpenCloseObservation.propTypes = {
	chart: PropTypes.object,
	title: PropTypes.string,
	subheader: PropTypes.string,
};