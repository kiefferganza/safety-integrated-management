// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader } from '@mui/material';
// utils
import { fNumber } from '@/utils/formatNumber';
// components
import Chart, { useChart } from '@/Components/chart';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 240;

const LEGEND_HEIGHT = 72;

const StyledChart = styled('div')(({ theme }) => ({
	height: CHART_HEIGHT,
	marginTop: theme.spacing(5),
	'& .apexcharts-canvas svg': {
		height: CHART_HEIGHT,
	},
	'& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
		overflow: 'visible',
	},
	'& .apexcharts-legend': {
		height: LEGEND_HEIGHT,
		alignContent: 'center',
		position: 'relative !important',
		borderTop: `solid 1px ${theme.palette.divider}`,
		top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
	},
}));

const AnalyticsTBTWorkDays = ({ title, subheader, chart, action, ...other }) => {
	const theme = useTheme();

	const { colors, series, options } = chart;

	const chartSeries = series.map((i) => i.value);

	const chartOptions = useChart({
		chart: {
			sparkline: {
				enabled: true,
			},
		},
		colors,
		labels: series.map((i) => i.label),
		stroke: {
			colors: [theme.palette.background.paper],
		},
		legend: {
			floating: true,
			horizontalAlign: 'center',
		},
		dataLabels: {
			enabled: true,
			dropShadow: { enabled: false },
		},
		tooltip: {
			fillSeriesColor: false,
			y: {
				formatter: (value) => fNumber(value),
				title: {
					formatter: (seriesName) => `${seriesName}`,
				},
			},
		},
		plotOptions: {
			pie: { donut: { labels: { show: false } } },
		},
		...options,
	});

	return (
		<Card sx={{ height: "100%" }} {...other}>
			<CardHeader title={title} subheader={subheader} action={action} />

			<StyledChart dir="ltr">
				<Chart type="pie" series={chartSeries} options={chartOptions} height={160} />
			</StyledChart>
		</Card>
	);
}

export default AnalyticsTBTWorkDays