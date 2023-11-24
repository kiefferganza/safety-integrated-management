// @mui
import { CardHeader, Box } from '@mui/material';
// components
import Chart, { useChart } from '@/Components/chart';

const AnalyticsTBTLine = ({ title, subheader = "", chart, action, height = 364, ...other }) => {
	const { labels, colors, series, options } = chart;

	const chartOptions = useChart({
		colors,
		stroke: {
			show: true,
			width: 2,
			colors: ['transparent'],
		},
		plotOptions: {
			bar: {
				columnWidth: '60%',
				barHeight: '100%',
				borderRadius: 2,
				borderRadiusApplication: 'end',
				dataLabels: {
					position: 'top',
				}
			},
		},
		dataLabels: {
			enabled: true,
			dropShadow: {
				enabled: true,
				blur: 1,
				opacity: 0.25,
			},
			formatter: function (val) {
				return val.toLocaleString("en-US");
			},
			offsetX: 0,
			style: {
				fontSize: '9px'
			}
		},
		fill: {
			type: series.map((i) => i.fill),
		},
		labels,
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
		<>
			<CardHeader title={title} subheader={subheader} action={action} />

			<Box sx={{ p: 3, pb: 1 }} dir="ltr">
				<Chart type="line" series={series} options={chartOptions} height={height} />
			</Box>
		</>
	);
}

export default AnalyticsTBTLine