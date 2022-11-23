import PropTypes from 'prop-types';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Card, Avatar, Divider, Typography, Stack, IconButton } from '@mui/material';
// utils
import { fShortenNumber } from '@/utils/formatNumber';
// _mock
import { _socials } from '../../../../_mock/arrays';
// components
import Image from '@/Components/image';
import Iconify from '@/Components/iconify';
import SvgColor from '@/Components/svg-color';
import { randomNumberRange } from '@/_mock';

// ----------------------------------------------------------------------

const StyledOverlay = styled('div')(({ theme }) => ({
	top: 0,
	left: 0,
	zIndex: 8,
	width: '100%',
	height: '100%',
	position: 'absolute',
	backgroundColor: alpha(theme.palette.grey[900], 0.64),
}));

// ----------------------------------------------------------------------

UserCard.propTypes = {
	user: PropTypes.object,
};

export default function UserCard ({ user, idx }) {
	const { firstname, lastname, user_type, email, img_src } = user;

	return (
		<Card sx={{ textAlign: 'center' }}>
			<Box sx={{ position: 'relative' }}>
				<SvgColor
					src="/storage/assets/shape_avatar.svg"
					sx={{
						width: 144,
						height: 62,
						zIndex: 10,
						left: 0,
						right: 0,
						bottom: -26,
						mx: 'auto',
						position: 'absolute',
						color: 'background.paper',
					}}
				/>

				<Avatar
					alt={firstname + " " + lastname}
					src={img_src ? `/storage/media/photos/employee/${img_src}` : null}
					sx={{
						width: 64,
						height: 64,
						zIndex: 11,
						left: 0,
						right: 0,
						bottom: -32,
						mx: 'auto',
						position: 'absolute',
					}}
				/>

				<StyledOverlay />

				<Image src={`https://api-dev-minimal-v4.vercel.app/assets/images/covers/cover_${idx + 1}.jpg`} ratio="16/9" />
			</Box>

			<Typography variant="subtitle1" sx={{ mt: 6, mb: 0.5 }}>
				{firstname + " " + lastname}
			</Typography>

			<Typography variant="body2" sx={{ color: 'text.secondary' }}>
				{user_type === 0 ? "Admin" : "User"}
			</Typography>


			<Stack direction="row" alignItems="center" justifyContent="center" sx={{ my: 1 }}>
				{_socials.map((social) => (
					<IconButton
						key={social.name}
						sx={{
							color: social.color,
							'&:hover': {
								bgcolor: alpha(social.color, 0.08),
							},
						}}
					>
						<Iconify icon={social.icon} />
					</IconButton>
				))}
			</Stack>

			<Typography variant="body2" sx={{ color: 'secondary.main', mb: 3 }}>
				{email}
			</Typography>

			<Divider sx={{ borderStyle: 'dashed' }} />

			<Box display="grid" gridTemplateColumns="repeat(3, 1fr)" sx={{ py: 3 }}>
				<div>
					<Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
						Follower
					</Typography>
					<Typography variant="subtitle1">{fShortenNumber(randomNumberRange(999, 99999))}</Typography>
				</div>

				<div>
					<Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
						Following
					</Typography>

					<Typography variant="subtitle1">{fShortenNumber(randomNumberRange(999, 99999))}</Typography>
				</div>

				<div>
					<Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
						Total Post
					</Typography>
					<Typography variant="subtitle1">{fShortenNumber(randomNumberRange(999, 99999))}</Typography>
				</div>
			</Box>
		</Card>
	);
}
