import PropTypes from 'prop-types';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Card, Avatar, Divider, Typography, Stack, Link as MUILink } from '@mui/material';
// utils
import { getCurrentUserImage } from '@/utils/formatName';
import { fTimestamp } from '@/utils/formatTime';
import { excerpt } from '@/utils/exercpt';
// components
import SvgColor from '@/Components/svg-color';
import { fileFormat, fileThumb } from '@/Components/file-thumbnail';
import { Link, usePage } from '@inertiajs/inertia-react';

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

export default function DocEmployeeCard ({ employee, latestUploadedFile }) {
	const { companies } = usePage().props;
	const company = companies.find(c => c.company_id === +employee.company);

	return (
		<Card sx={{ textAlign: 'center', height: 1 }} variant="outlined">
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
					alt={employee.fullname}
					src={getCurrentUserImage(employee)}
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
				<Box className='wew' width={1} height={120} sx={{ background: "linear-gradient(135deg,#d262e3 0,#3f9ce8 100%)" }} />
			</Box>

			<Typography variant="subtitle1" sx={{ mt: 6, mb: 0.5 }}>
				{employee.fullname}
			</Typography>

			<Typography variant="body2" sx={{ color: 'text.secondary' }}>
				{employee?.position?.position}
			</Typography>

			{latestUploadedFile && (
				<Box display="flex" alignItems="center" justifyContent="center" sx={{ my: 1 }}>

					<MUILink
						component={Link}
						href={`/storage/media/docs/${latestUploadedFile.src}`}
						sx={{
							color: "text.primary"
						}}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Stack
							spacing={2}
							direction="row"
							alignItems="center"
						>
							<Avatar variant="rounded" sx={{ bgcolor: 'background.neutral', width: 36, height: 36, borderRadius: "9px" }}>
								<Box component="img" src={fileThumb(fileFormat(latestUploadedFile.src))} sx={{ width: 24, height: 24 }} />
							</Avatar>

							<Stack spacing={0.5} flexGrow={1}>
								<Typography variant="subtitle2" sx={{ textDecoration: "none" }}>{excerpt(latestUploadedFile.src, 24)}</Typography>
							</Stack>
						</Stack>
					</MUILink>
				</Box>
			)}

			<Divider sx={{ borderStyle: 'dashed' }} />

			<Box sx={{ py: 3 }}>
				<Box display="grid" gridTemplateColumns="repeat(2, 1fr)" sx={{ mb: 3 }}>
					<Box sx={{ px: 1 }}>
						<Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
							Email
						</Typography>
						<Typography variant="caption">{employee.email}</Typography>
					</Box>

					<Box sx={{ px: 1 }}>
						<Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
							Phone No.
						</Typography>
						<Typography variant="caption">{employee.phone_no}</Typography>
					</Box>
				</Box>
				<Box display="grid" gridTemplateColumns="repeat(2, 1fr)">
					<Box sx={{ px: 1 }}>
						<Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
							Company
						</Typography>
						<Typography variant="caption">{company?.company_name}</Typography>
					</Box>

					<Box sx={{ px: 1 }}>
						<Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
							Department
						</Typography>
						<Typography variant="caption">{employee?.department?.department}</Typography>
					</Box>
				</Box>
			</Box>
		</Card >
	);
}
