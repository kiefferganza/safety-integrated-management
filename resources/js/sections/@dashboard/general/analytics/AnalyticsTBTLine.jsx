// @mui
import { Card, CardHeader, Box } from '@mui/material';
// components
import Chart, { useChart } from '@/Components/chart';

const AnalyticsTBTLine = ({ title, subheader = "", chart, action, ...other }) => {
	const { labels, colors, series, options } = chart;

	const chartOptions = useChart({
		colors,
		plotOptions: {
			bar: {
				columnWidth: '80%'
			},
		},
		dataLabels: {
			enabled: true,
			position: 'top',
			formatter: function (val) {
				return val.toLocaleString("en-US");
			},
			offsetX: 0,
			style: {
				fontSize: '8px'
			}
		},
		fill: {
			type: series.map((i) => i.fill),
		},
		labels,
		// xaxis: {
		// 	type: 'datetime',
		// 	labels: {
		// 		format: 'MMM yyyy'
		// 	}
		// },
		yaxis: {
			show: false
		},
		tooltip: {
			shared: true,
			intersect: false,
			y: {
				formatter: (value) => {
					if (typeof value !== 'undefined') {
						return `${value.toFixed(0)}`;
					}
					return value;
				},
			},
		},
		...options,
	});

	return (
		<Card sx={{ height: "100%" }} {...other}>
			<CardHeader title={title} subheader={subheader} action={action} />

			<Box sx={{ p: 3, pb: 1 }} dir="ltr">
				<Chart type="line" series={series} options={chartOptions} height={364} />
			</Box>
		</Card>
	);
}

export default AnalyticsTBTLine