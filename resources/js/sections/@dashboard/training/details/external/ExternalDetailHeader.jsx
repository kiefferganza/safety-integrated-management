// @mui
import {
	Box,
	Grid,
	Typography,
	Stack,
	Avatar,
	Tooltip,
	Link as MuiLink
} from '@mui/material';
// utils
import { fDate } from '@/utils/formatTime';
// components
import Image from '@/Components/image';
import { getTrainingStatus } from '@/utils/formatDates';
import { fileFormat, fileThumb } from '@/Components/file-thumbnail';
import { ellipsis } from '@/utils/exercpt';

const ExternalDetailHead = ({ training }) => {
	training.status = getTrainingStatus(training.date_expired || new Date);
	return (
		<>
			<Box sx={{ mb: 2 }}>
				<Box sx={{ mb: { xs: 0, md: -1 } }}>
					<Image disabledEffect alt="logo" src="/logo/Fiafi-logo.png" sx={{ maxWidth: 160, margin: { xs: '0px auto 8px auto', md: 0 } }} />
				</Box>
				<Box>
					<Typography variant="h4" textAlign="center">Third Party Training</Typography>
				</Box>
			</Box>

			<Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 3, md: 0 }} justifyContent="space-between" sx={{ mb: 5 }}>
				<Stack alignItems="center" flex={1}>
					<Box>
						<Typography variant="body2" fontWeight={700}>CMS Number:</Typography>
					</Box>
					<Box>
						<Typography variant="body1" sx={{ textTransform: 'uppercase' }}>{training?.cms || ''}</Typography>
					</Box>
				</Stack>

				<Stack alignItems="center" flex={1}>
					<Box>
						<Typography variant="body2" fontWeight={700} textAlign="center">Revision:</Typography>
					</Box>
					<Box>
						<Typography variant="body1" >{training?.revision_no || 0}</Typography>
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

			<Grid container spacing={{ xs: 2, md: 5 }} sx={{ mb: 4 }}>
				<Grid item xs={12} sm={6}>
					<Box sx={{ mb: 1 }}>
						<Box>
							<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Course Title</Typography>
						</Box>
						<Box>
							<Typography variant="body1" sx={{ color: 'text.secondary' }}>{training?.course?.course_name || training.title || ''}</Typography>
						</Box>
					</Box>

					<Box sx={{ mb: 1 }}>
						<Box>
							<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Training Location</Typography>
						</Box>
						<Box>
							<Typography variant="body1" sx={{ color: 'text.secondary' }}>{training.location}</Typography>
						</Box>
					</Box>

					<Box sx={{ mb: 1 }}>
						<Box>
							<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Contract No.</Typography>
						</Box>
						<Box>
							<Typography variant="body1" sx={{ color: 'text.secondary' }}>{training.contract_no}</Typography>
						</Box>
					</Box>

					<Box sx={{ mb: 1 }}>
						<Box>
							<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Conducted By</Typography>
						</Box>
						<Box>
							<Typography variant="body1" sx={{ color: 'text.secondary' }}>{training.trainer}</Typography>
						</Box>
					</Box>
					{training?.training_center && (
						<Box sx={{ mb: 1 }}>
							<Box>
								<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Training Center</Typography>
							</Box>
							<Box>
								<Typography variant="body1" sx={{ color: 'text.secondary' }}>{training?.training_center || 'N/A'}</Typography>
							</Box>
						</Box>
					)}
				</Grid>
				<Grid item xs={12} sm={6}>
					<Box sx={{ mb: 1 }}>
						<Box>
							<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Date of Training</Typography>
						</Box>
						<Box>
							<Typography variant="body1" sx={{ color: 'text.secondary' }}>
								{training?.training_date ? fDate(training.training_date) : ''}
							</Typography>
						</Box>
					</Box>

					<Box sx={{ mb: 1 }}>
						<Box>
							<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Date Expired</Typography>
						</Box>
						<Box>
							<Typography variant="body1" sx={{ color: 'text.secondary' }}>
								{training?.date_expired ? fDate(training.date_expired) : ''}
							</Typography>
						</Box>
					</Box>

					<Box sx={{ mb: 1 }}>
						<Box>
							<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Training Hours</Typography>
						</Box>
						<Box>
							<Typography variant="body1" sx={{ color: 'text.secondary' }}>{training.training_hrs}</Typography>
						</Box>
					</Box>

					<Box sx={{ mb: 1 }}>
						<Box>
							<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Status</Typography>
						</Box>
						<Box>
							<Typography variant="body1" color={training?.status?.rawColor}>{training?.status?.text}</Typography>
						</Box>
					</Box>
					<Box sx={{ mb: 1 }}>
						<Box>
							<Typography sx={{ mb: 1, fontWeight: 700 }} variant="body2">Current File</Typography>
						</Box>
						<Box minHeight={24}>
							{training.external_status?.currentFile ? (
								<Tooltip title={training.external_status.currentFile.fileName}>
									<MuiLink
										component="a"
										href={training.external_status.currentFile.url}
										sx={{
											color: "text.primary"
										}}
										target="_file"
										rel="noopener noreferrer"
									>
										<Stack
											spacing={2}
											direction="row"
											alignItems="center"
										>
											<Avatar variant="rounded" sx={{ bgcolor: 'background.neutral', width: 36, height: 36, borderRadius: "9px" }}>
												<Box component="img" src={fileThumb(fileFormat(training.external_status.currentFile.url))} sx={{ width: 24, height: 24 }} />
											</Avatar>

											<Stack spacing={0.5} flexGrow={1}>
												<Typography variant="subtitle2" sx={{ textDecoration: "none" }}>{ellipsis(training.external_status.currentFile.name || "", 24)}</Typography>
											</Stack>
										</Stack>
									</MuiLink>
								</Tooltip>
							) : (
								<Box minHeight={24}>
									<Typography variant="body1" sx={{ color: 'text.secondary' }}>No signed file yet.</Typography>
								</Box>
							)}
						</Box>
					</Box>
				</Grid>
			</Grid>
		</>
	)
}

export default ExternalDetailHead