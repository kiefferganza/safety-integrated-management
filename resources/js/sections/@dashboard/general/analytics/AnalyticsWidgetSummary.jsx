import PropTypes from 'prop-types';
import CountUp from 'react-countup';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import { Box, Card, Typography } from '@mui/material';
// utils
import { bgGradient } from '@/utils/cssStyles';
// components
import Iconify from '@/Components/iconify';

// ----------------------------------------------------------------------

AnalyticsWidgetSummary.propTypes = {
	sx: PropTypes.object,
	icon: PropTypes.string,
	color: PropTypes.string,
	title: PropTypes.string,
	total: PropTypes.number,
};

export default function AnalyticsWidgetSummary ({ title, total, icon, data, color = 'primary', sx, ...other }) {
	const theme = useTheme();

	return (
		<Card
			sx={{
				py: 5,
				boxShadow: 0,
				textAlign: 'center',
				color: (theme) => theme.palette[color].darker,
				bgcolor: (theme) => theme.palette[color].lighter,
				...sx,
			}}
			{...other}
		>
			<Iconify
				icon={icon}
				sx={{
					mb: 3,
					p: 2.5,
					width: 64,
					height: 64,
					borderRadius: '50%',
					color: (theme) => theme.palette[color].dark,
					...bgGradient({
						direction: '135deg',
						startColor: `${alpha(theme.palette[color].dark, 0)} 0%`,
						endColor: `${alpha(theme.palette[color].dark, 0.24)} 100%`,
					}),
				}}
			/>

			<Typography variant="subtitle2" sx={{ opacity: 0.64, mb: 1 }}>
				{title}
			</Typography>

			<Box display="flex" alignItems="center" gap={2} justifyContent="center">
				<Typography variant="h5">
					<CountUp start={0} end={(total || 0)} duration={1} separator="," />
				</Typography>


				{/* <Box>
					<Typography variant="h5">{fShortenNumber(total)}</Typography>
					<Typography variant="subtitle2" sx={{ opacity: 0.64 }}>{label}</Typography>
				</Box>
				<Box>
					<Typography variant="h5">{fShortenNumber(2312312)}</Typography>
					<Typography variant="subtitle2" sx={{ opacity: 0.64 }}>ITD</Typography>
				</Box> */}
			</Box>
		</Card>
	);
}
