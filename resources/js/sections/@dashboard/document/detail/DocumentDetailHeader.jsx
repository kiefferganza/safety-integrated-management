// MUI
const { Box, Stack, Typography } = await import('@mui/material');
// Component
const { Image } = await import('@/Components/image/Image');

const DocumentDetailHeader = ({ title, cms, rev }) => {
	return (
		<Box>
			<Box sx={{ mb: 2, px: 3 }}>
				<Image disabledEffect alt="logo" src="/logo/Fiafi-logo.png" sx={{ maxWidth: 160, margin: { xs: '0px auto 8px auto', md: 0 } }} />
			</Box>
			<Box sx={{ mb: 3 }}>
				<Typography variant="h5" textAlign="center">{title}</Typography>
			</Box>
			<Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 3, md: 0 }} justifyContent="space-between" sx={{ mb: 5 }}>
				<Stack alignItems="center" flex={1}>
					<Box>
						<Typography variant="body2" fontWeight={700}>CMS Number:</Typography>
					</Box>
					<Box>
						<Typography variant="body1" sx={{ textTransform: 'uppercase' }}>{cms}</Typography>
					</Box>
				</Stack>

				<Stack alignItems="center" flex={1}>
					<Box>
						<Typography variant="body2" fontWeight={700} textAlign="center">Revision:</Typography>
					</Box>
					<Box>
						<Typography variant="body1" >{rev || 0}</Typography>
					</Box>
				</Stack>

				<Stack alignItems="center" flex={1}>
					<Box>
						<Typography variant="body2" fontWeight={700}>Rollout Date:</Typography>
					</Box>
					<Box>
						<Typography></Typography>
					</Box>
				</Stack>
			</Stack>
		</Box>
	)
}

export default DocumentDetailHeader