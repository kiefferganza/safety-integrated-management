import PropTypes from 'prop-types';
// @mui
import { Card, Stack, Typography, Divider } from '@mui/material';
// utils
import { fNumber } from '@/utils/formatNumber';

// ----------------------------------------------------------------------

export default function ProfileFollowInfo () {
	return (
		<Card sx={{ py: 3 }}>
			<Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
				<Stack width={1} textAlign="center">
					<Typography variant="h4">{fNumber(0)}</Typography>

					<Typography variant="body2" sx={{ color: 'text.secondary' }}>
						Follower
					</Typography>
				</Stack>

				<Stack width={1} textAlign="center">
					<Typography variant="h4">{fNumber(0)}</Typography>

					<Typography variant="body2" sx={{ color: 'text.secondary' }}>
						Following
					</Typography>
				</Stack>
			</Stack>
		</Card>
	);
}
