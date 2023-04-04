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
import { getCurrentUserImage, getCurrentUserName } from '@/utils/formatName';

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

export function UserCard ({ user }) {
	const { user_type, email, social_accounts, employee, profile } = user;

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
					alt={employee?.fullname}
					src={profile?.thumbnailLarge}
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

				<Image src={`/storage/assets/covers/card-cover-${randomNumberRange(1, 7)}.jpg`} ratio="16/9" />
			</Box>

			<Typography variant="subtitle1" sx={{ mt: 6, mb: 0.5 }}>
				{employee?.fullname}
			</Typography>

			<Typography variant="body2" sx={{ color: 'text.secondary' }}>
				{user_type === 0 ? "Admin" : "User"}
			</Typography>


			{social_accounts?.length > 0 && (
				<Stack direction="row" alignItems="center" justifyContent="center" sx={{ my: 1 }}>
					{social_accounts.map((social) => {
						let icon = "eva:facebook-fill";
						let iconColor = "#1877F2";
						switch (social.type) {
							case "instagram":
								icon = "ant-design:instagram-filled";
								iconColor = "#E02D69";
								break;
							case "linkedin":
								icon = "eva:linkedin-fill";
								iconColor = "#007EBB";
								break;
							case "twitter":
								icon = "eva:twitter-fill";
								iconColor = "#00AAEC";
								break;
							default:
								break;
						}

						return (
							<IconButton
								key={social.social_id}
								href={social.social_link}
								target="_blank"
								rel="nofollow noopener noreferrer"
								sx={{
									color: iconColor,
									'&:hover': {
										bgcolor: alpha(iconColor, 0.08),
									},
								}}
							>
								<Iconify icon={icon} />
							</IconButton>
						)
					})}
				</Stack>
			)}

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
						Total Training
					</Typography>
					<Typography variant="subtitle1">{employee?.trainings_count ? fShortenNumber(employee?.trainings_count) : 0}</Typography>
				</div>
			</Box>
		</Card>
	);
}
