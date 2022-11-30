import PropTypes from 'prop-types';
// @mui
import { alpha } from '@mui/material/styles';
import { Stack, Typography, Box, CircularProgress } from '@mui/material';
// utils
import { fShortenNumber } from '@/utils/formatNumber';
// components
import Iconify from '@/Components/iconify';

// ----------------------------------------------------------------------


const TrainingAnalitic = ({ title, total, icon, color, percent, hours }) => {
	return (
		<Stack direction="row" alignItems="center" justifyContent="center" sx={{ width: 1, minWidth: 200 }}>
			<Stack alignItems="center" justifyContent="center" sx={{ position: 'relative' }}>
				<Iconify icon={icon} width={24} sx={{ color, position: 'absolute' }} />

				<CircularProgress variant="determinate" value={percent} size={56} thickness={4} sx={{ color, opacity: 0.48 }} />

				<CircularProgress
					variant="determinate"
					value={100}
					size={56}
					thickness={4}
					sx={{
						top: 0,
						left: 0,
						opacity: 0.48,
						position: 'absolute',
						color: (theme) => alpha(theme.palette.grey[500], 0.16),
					}}
				/>
			</Stack>

			<Stack spacing={0.5} sx={{ ml: 2 }}>
				<Typography variant="h6">{title}</Typography>
				{total > 0 && (
					<Typography variant="subtitle2">
						{fShortenNumber(hours) || 0}{' '}
						<Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
							total hours
						</Box>
					</Typography>
				)}

				<Typography variant="subtitle2">
					{fShortenNumber(total) || 0}{' '}
					<Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
						trainings
					</Box>
				</Typography>
			</Stack>
		</Stack>
	)
}

export default TrainingAnalitic;

TrainingAnalitic.propTypes = {
	icon: PropTypes.string,
	title: PropTypes.string,
	color: PropTypes.string,
	total: PropTypes.number,
	percent: PropTypes.number,
};