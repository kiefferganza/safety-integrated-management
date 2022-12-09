import PropTypes from 'prop-types';
// @mui
import { Card, Stack, Typography, Divider } from '@mui/material';
// utils
import { fNumber } from '@/utils/formatNumber';

// ----------------------------------------------------------------------

export default function ProfileFollowInfo ({ titleFollower, titleFollowing, follower, following }) {
	return (
		<Card sx={{ py: 3 }}>
			<Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
				<Stack width={1} textAlign="center">
					<Typography variant="h4">{fNumber(follower || 0)}</Typography>

					<Typography variant="body2" sx={{ color: 'text.secondary' }}>
						{titleFollower || "Follower"}
					</Typography>
				</Stack>

				<Stack width={1} textAlign="center">
					<Typography variant="h4">{fNumber(following || 0)}</Typography>

					<Typography variant="body2" sx={{ color: 'text.secondary' }}>
						{titleFollowing || "Following"}
					</Typography>
				</Stack>
			</Stack>
		</Card>
	);
}
