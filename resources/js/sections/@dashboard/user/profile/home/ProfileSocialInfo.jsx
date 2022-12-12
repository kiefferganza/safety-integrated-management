import PropTypes from 'prop-types';
// @mui
import { Link, Card, CardHeader, Stack } from '@mui/material';
// components
import Iconify from '@/Components/iconify';

// ----------------------------------------------------------------------

export default function ProfileSocialInfo ({ socialAccounts }) {

	if (!socialAccounts) {
		return null;
	}

	return (
		<Card>
			<CardHeader title="Social" />

			<Stack spacing={2} sx={{ p: 3 }}>
				{socialAccounts.map((link) => {
					let icon = "eva:facebook-fill";
					let iconColor = "#1877F2";
					switch (link.type) {
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
						<Stack key={link.social_id} direction="row" sx={{ wordBreak: 'break-all' }}>
							<Iconify
								icon={icon}
								sx={{
									mr: 2,
									flexShrink: 0,
									color: iconColor,
								}}
							/>
							<Link component="span" variant="body2" color="text.primary">
								{link.social_link}
							</Link>
						</Stack>
					)
				})}
			</Stack>
		</Card>
	);
}
