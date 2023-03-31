import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Card, Typography, CardHeader, Stack } from '@mui/material';
// components
import Iconify from '@/Components/iconify';
import { InertiaLink } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

const StyledIcon = styled(Iconify)(({ theme }) => ({
	width: 20,
	height: 20,
	marginTop: 1,
	flexShrink: 0,
	marginRight: theme.spacing(2),
}));

// ----------------------------------------------------------------------

export default function ProfileAbout ({ editLink, quote, country, email, role, company, department, name, action }) {
	return (
		<Card>
			<CardHeader title="About" />

			<Stack spacing={2} sx={{ p: 3 }}>
				{!!quote ? (
					<Typography variant="body2" sx={{ wordBreak: "break-word" }}>{quote}</Typography>
				) : (
					editLink && (
						<Link variant="body2" component={InertiaLink} href={editLink}>
							Add information
						</Link>
					)
				)}

				{name && (
					<Stack direction="row">
						<StyledIcon icon="mdi:account" />

						<Typography variant="body2">
							<Link component="span" variant="subtitle2" color="text.primary">
								{name}
							</Link>
						</Typography>
					</Stack>
				)}

				{country && (
					<Stack direction="row">
						<StyledIcon icon="eva:pin-fill" />

						<Typography variant="body2">
							Live at &nbsp;
							<Link component="span" variant="subtitle2" color="text.primary">
								{country}
							</Link>
						</Typography>
					</Stack>
				)}

				<Stack direction="row">
					<StyledIcon icon="eva:email-fill" />
					<Typography variant="body2">{email}</Typography>
				</Stack>

				{company && (
					<Stack direction="row">
						<StyledIcon icon="mdi:account-multiple" />

						<Typography variant="body2">
							{role} at &nbsp;
							<Link component="span" variant="subtitle2" color="text.primary">
								{company}
							</Link>
						</Typography>
					</Stack>
				)}

				{department && (
					<Stack direction="row">
						<StyledIcon icon="mdi:bank" />

						<Typography variant="body2">
							{/* Studied at &nbsp; */}
							<Link component="span" variant="subtitle2" color="text.primary">
								{department}
							</Link>
						</Typography>
					</Stack>
				)}
				{action}
			</Stack>
		</Card>
	);
}
