import { fDate } from '@/utils/formatTime';
// MUI
const { Box, Stack, Typography, Grid, Card, Divider } = await import('@mui/material');
// Component
const { DocEmployeeCard } = await import('./DocEmployeeCard');
const { Image } = await import('@/Components/image/Image');

const DocumentDetailHeader = ({ title, cms, document, latestUploadedFile, rolloutDate }) => {
	const {
		title: documentTitle,
		originator,
		sequence_no,
		rev,
		date_uploaded,
		project_code,
		discipline,
		document_type,
		document_zone,
		document_level,
	} = document;

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
						<Typography>{fDate(rolloutDate)}</Typography>
					</Box>
				</Stack>
			</Stack>
			<Grid container spacing={3} alignItems="stretch">
				<Grid item xs={12} md={5}>
					<DocEmployeeCard employee={document.employee} latestUploadedFile={latestUploadedFile} />
				</Grid>
				<Grid item xs={12} md={7}>
					<Card sx={{ p: 3, height: 1 }} variant="outlined">
						<Box display="grid" gridTemplateColumns="repeat(2, 1fr)">
							<div>
								<Box>
									<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Project Code</Typography>
								</Box>
								<Box>
									<Typography variant="body1" sx={{ color: 'text.secondary' }}>{project_code}</Typography>
								</Box>
							</div>
							<div>
								<Box>
									<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Originator</Typography>
								</Box>
								<Box>
									<Typography variant="body1" sx={{ color: 'text.secondary' }}>{originator}</Typography>
								</Box>
							</div>
						</Box>

						<Divider flexItem sx={{ borderStyle: 'dashed', my: 1.5 }} />

						<Box display="grid" gridTemplateColumns="repeat(2, 1fr)">
							<div>
								<Box>
									<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Discipline</Typography>
								</Box>
								<Box>
									<Typography variant="body1" sx={{ color: 'text.secondary' }}>{discipline}</Typography>
								</Box>
							</div>
							<div>
								<Box>
									<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Type</Typography>
								</Box>
								<Box>
									<Typography variant="body1" sx={{ color: 'text.secondary' }}>{document_type}</Typography>
								</Box>
							</div>
						</Box>

						<Divider flexItem sx={{ borderStyle: 'dashed', my: 1.5 }} />

						<Box display="grid" gridTemplateColumns="repeat(2, 1fr)">
							<div>
								<Box>
									<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Zone</Typography>
								</Box>
								<Box>
									<Typography variant="body1" sx={{ color: 'text.secondary' }}>{document_zone || "N/A"}</Typography>
								</Box>
							</div>
							<div>
								<Box>
									<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Level</Typography>
								</Box>
								<Box>
									<Typography variant="body1" sx={{ color: 'text.secondary' }}>{document_level || "N/A"}</Typography>
								</Box>
							</div>
						</Box>

						<Divider flexItem sx={{ borderStyle: 'dashed', my: 1.5 }} />

						<Box display="grid" gridTemplateColumns="repeat(2, 1fr)">
							<div>
								<Box>
									<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Sequence No.</Typography>
								</Box>
								<Box>
									<Typography variant="body1" sx={{ color: 'text.secondary' }}>{sequence_no}</Typography>
								</Box>
							</div>
							<div>
								<Box>
									<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Rev No.</Typography>
								</Box>
								<Box>
									<Typography variant="body1" sx={{ color: 'text.secondary' }}>{rev || 0}</Typography>
								</Box>
							</div>
						</Box>

						<Divider flexItem sx={{ borderStyle: 'dashed', my: 1.5 }} />

						<Box display="grid" gridTemplateColumns="repeat(2, 1fr)">
							<div>
								<Box>
									<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Transmittal Date</Typography>
								</Box>
								<Box>
									<Typography variant="body1" sx={{ color: 'text.secondary' }}>{fDate(date_uploaded)}</Typography>
								</Box>
							</div>
							<div>
								<Box>
									<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Document Title</Typography>
								</Box>
								<Box>
									<Typography variant="body1" sx={{ color: 'text.secondary' }}>{documentTitle}</Typography>
								</Box>
							</div>
						</Box>
					</Card>
				</Grid>
			</Grid>
			<Divider flexItem sx={{ borderStyle: 'dashed', my: 3 }} />
		</Box>
	)
}

export default DocumentDetailHeader