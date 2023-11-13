import PropTypes from 'prop-types';
import CountUp from 'react-countup';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import { Box, Card, Skeleton, Typography } from '@mui/material';
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
	isLoading: PropTypes.bool
};

export default function AnalyticsWidgetSummary ({ isLoading, title, total = 0, icon, data, color = 'primary', sx, ...other }) {
	const theme = useTheme();

	if (isLoading) {
		return (
			<Card
				sx={{
					display: 'flex',
					alignItems: 'center',
					p: 3,
					boxShadow: 0,
					color: (theme) => theme.palette[color].darker,
					bgcolor: (theme) => theme.palette[color].lighter,
					...sx,
				}}
				{...other}
			>
				<Box sx={{ flexGrow: 1 }}>
					<Skeleton variant="rounded" width='25%' height={18} sx={{ marginLeft: 0, mb: 1.5 }} />
					<Skeleton variant="rounded" width='60%' height={24} sx={{ marginLeft: 0, mt: 2 }} />
				</Box>
				<Skeleton variant="circular" width={64} height={64} sx={{ marginX: 'auto', mb: 3 }} />
			</Card>
		)
	}

	return (
		<Card
			sx={{
				display: 'flex',
				alignItems: 'center',
				p: 3,
				boxShadow: 0,
				color: (theme) => theme.palette[color].darker,
				bgcolor: (theme) => theme.palette[color].lighter,
				...sx
			}}
			{...other}
		>
			<Box sx={{ flexGrow: 1 }}>
				<Typography variant="subtitle2">{title}</Typography>


				<Typography variant="h3" sx={{ mt: 3 }}>
					<CountUp end={total || 0} duration={3} delay={0.6} />
				</Typography>
			</Box>

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
		</Card>
	);
}
