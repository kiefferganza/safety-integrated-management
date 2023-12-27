// @mui
import { CardHeader, Box } from '@mui/material';
// components
import Chart, { useChart } from '@/Components/chart';

const AnalyticsTBTLine = ({ title, subheader = "", chart, action, height = 364 }) => {
	const { categories, colors, series, options } = chart;

	const chartOptions = useChart({
		colors,
		// stroke: {
		// 	show: true,
		// 	// width: 2,
		// 	colors: ['transparent'],
		// },
		plotOptions: {
			bar: {
				// columnWidth: '60%',
				// barHeight: '100%',
				// borderRadius: 2,
				// borderRadiusApplication: 'end',
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
			// offsetX: 0,
			style: {
				fontSize: '9px'
			}
		},
		xaxis: {
      show: true,
      categories,
      labels: {
        style: {
					fontSize: '10px',
				},
      }
    },
		yaxis: {
			show: false
		},
		...options,
	});
  
	return (
		<>
			<CardHeader title={title} subheader={subheader} action={action} />

			<Box sx={{ p: 3, pb: 1 }} dir="ltr">
				<Chart type="bar" series={series} options={chartOptions} height={height} />
			</Box>
		</>
	);
}

export default AnalyticsTBTLine