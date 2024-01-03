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
          color: (val, ctx) => {
            console.log({val, ctx})
            return "#000"
          },
				}
			},
		},
		dataLabels: {
			enabled: true,
			formatter: function (val) {
				return val.toLocaleString("en-US");
			},
			style: {
				fontSize: '9px',
			},
      background: {
        enabled: true,
        foreColor: colors[0],
        padding: 4,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#fff',
        opacity: 0.8,
        dropShadow: {
          enabled: false,
          top: 1,
          left: 1,
          blur: 1,
          color: '#000',
          opacity: 0.45
        }
      },
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