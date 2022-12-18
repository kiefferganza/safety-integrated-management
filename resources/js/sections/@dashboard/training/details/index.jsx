import PropTypes from 'prop-types';
// @mui
import {
	Box,
	Card,
	Grid,
	Table,
	TableRow,
	TableBody,
	TableHead,
	TableCell,
	Typography,
	TableContainer,
	Stack,
	Link,
} from '@mui/material';
// utils
import { fDate } from '@/utils/formatTime';
import { excerpt } from '@/utils/exercpt';
import { fCurrencyNumber } from '@/utils/formatNumber';
// components
import Image from '@/Components/image';
import Scrollbar from '@/Components/scrollbar';
//
import TrainingToolbar from './TrainingToolbar';

// ----------------------------------------------------------------------

TrainingDetails.propTypes = {
	training: PropTypes.object,
	trainings: PropTypes.array,
	module: PropTypes.string,
};

export default function TrainingDetails ({ training, trainings = [], module, url }) {
	if (!training || !trainings) {
		return null;
	}

	const getTotalAmmount = training?.external_details && training?.type === 3 ? training?.trainees?.length * (parseInt(training?.external_details?.course_price)) : 0;

	return (
		<>
			<TrainingToolbar training={training} module={module} url={url} />

			<Card sx={{ pt: { xs: 3, md: 5 }, px: { xs: 3, md: 8 } }}>
				<Box sx={{ mb: 2 }}>
					<Box sx={{ mb: { xs: 0, md: -1 } }}>
						<Image disabledEffect alt="logo" src="/logo/Fiafi-logo.png" sx={{ maxWidth: 160, margin: { xs: '0px auto 8px auto', md: 0 } }} />
					</Box>
					<Box>
						<Typography variant="h4" textAlign="center">{module} Training</Typography>
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

				<Grid container spacing={{ xs: 2, md: 8 }} sx={{ mb: { xs: 5, md: 8 } }}>
					<Grid item xs={12} sm={6}>
						<Box sx={{ mb: 3 }}>
							<Box>
								<Typography sx={{ mb: 1.5 }} variant="body1">Course Title</Typography>
							</Box>
							<Box borderBottom={1}>
								<Typography variant="body1" textAlign="center">{training.title}</Typography>
							</Box>
						</Box>

						<Box sx={{ mb: 3 }}>
							<Box>
								<Typography sx={{ mb: 1.5 }} variant="body1">Training Location</Typography>
							</Box>
							<Box borderBottom={1}>
								<Typography variant="body1" textAlign="center">{training.location}</Typography>
							</Box>
						</Box>

						<Box sx={{ mb: 3 }}>
							<Box>
								<Typography sx={{ mb: 1.5 }} variant="body1">Contract No.</Typography>
							</Box>
							<Box borderBottom={1}>
								<Typography variant="body1" textAlign="center">{training.contract_no}</Typography>
							</Box>
						</Box>

						<Box sx={{ mb: 3 }}>
							<Box>
								<Typography sx={{ mb: 1.5 }} variant="body1">Conducted By</Typography>
							</Box>
							<Box borderBottom={1}>
								<Typography variant="body1" textAlign="center">{training.trainer}</Typography>
							</Box>
						</Box>
						{training?.training_center && (
							<Box sx={{ mb: 3 }}>
								<Box>
									<Typography sx={{ mb: 1.5 }} variant="body1">Training Center</Typography>
								</Box>
								<Box borderBottom={1}>
									<Typography variant="body1" textAlign="center">{training?.training_center || 'N/A'}</Typography>
								</Box>
							</Box>
						)}
					</Grid>
					<Grid item xs={12} sm={6}>
						<Box sx={{ mb: 3 }}>
							<Box>
								<Typography sx={{ mb: 1.5 }} variant="body1">Date of Training</Typography>
							</Box>
							<Box borderBottom={1}>
								<Typography variant="body1" textAlign="center">
									{training?.training_date ? fDate(training.training_date) : ''}
								</Typography>
							</Box>
						</Box>

						<Box sx={{ mb: 3 }}>
							<Box>
								<Typography sx={{ mb: 1.5 }} variant="body1">Date Expired</Typography>
							</Box>
							<Box borderBottom={1}>
								<Typography variant="body1" textAlign="center">
									{training?.date_expired ? fDate(training.date_expired) : ''}
								</Typography>
							</Box>
						</Box>

						<Box sx={{ mb: 3 }}>
							<Box>
								<Typography sx={{ mb: 1.5 }} variant="body1">Training Hours</Typography>
							</Box>
							<Box borderBottom={1}>
								<Typography variant="body1" textAlign="center">{training.training_hrs}</Typography>
							</Box>
						</Box>

						<Box sx={{ mb: 3 }}>
							<Box>
								<Typography sx={{ mb: 1.5 }} variant="body1">Status</Typography>
							</Box>
							<Box borderBottom={1}>
								<Typography variant="body1" textAlign="center" color={training?.status?.rawColor}>{training?.status?.text}</Typography>
							</Box>
						</Box>
					</Grid>
				</Grid>

				<TableContainer sx={{ overflow: 'unset', mb: 5 }}>
					<Scrollbar>
						<Table sx={{ minWidth: 960 }}>
							<TableHead
								sx={{
									borderBottom: 1,
									'& th': { backgroundColor: 'transparent' },
								}}
							>
								<TableRow>
									<TableCell align="left">S.no</TableCell>

									<TableCell align="center">Name</TableCell>

									<TableCell align="center">Position</TableCell>

									<TableCell align="center">Certificate</TableCell>

								</TableRow>
							</TableHead>

							<TableBody>
								{training?.trainees?.map((row, index) => (
									<TableRow
										key={index}
										sx={{
											borderBottom: 1,
										}}
									>
										<TableCell align="left">{index + 1}</TableCell>

										<TableCell align="center">{row.fullname}</TableCell>

										<TableCell align="center">{row.position}</TableCell>

										<TableCell align="center">
											{row?.src ? (
												<Link href={row?.src} target="_blank">
													{excerpt(row?.filename)}
												</Link>
											) : (
												"N/A"
											)}
										</TableCell>

									</TableRow>
								))}
							</TableBody>
						</Table>
					</Scrollbar>
				</TableContainer>

				{training?.external_details && training.type === 3 && (
					<>
						<Box sx={{ pt: 5 }}>
							<Grid container spacing={{ xs: 2, md: 8 }}>
								<Grid item xs={12} sm={4}>
									<Box sx={{ mb: 3 }}>
										<Box borderBottom={1}>
											<Typography variant="body1" textAlign="center">
												{`${training?.external_details?.requested?.firstname?.trim()} ${training?.external_details?.requested?.lastname?.trim()}`}
											</Typography>
										</Box>
										<Box>
											<Typography variant="body1" textAlign="center" sx={{ mt: 1 }}>Requested by</Typography>
										</Box>
									</Box>
								</Grid>
								<Grid item xs={12} sm={4}>
									<Box sx={{ mb: 3 }}>
										<Box borderBottom={1}>
											<Typography variant="body1" textAlign="center">
												{`${training?.external_details?.reviewer?.firstname?.trim()} ${training?.external_details?.reviewer?.lastname?.trim()}`}
											</Typography>
										</Box>
										<Box>
											<Typography variant="body1" textAlign="center" sx={{ mt: 1 }}>Reviewed by</Typography>
										</Box>
									</Box>
								</Grid>
								<Grid item xs={12} sm={4}>
									<Box sx={{ mb: 3 }}>
										<Box borderBottom={1}>
											<Typography variant="body1" textAlign="center">
												{`${training?.external_details?.approval?.firstname?.trim()} ${training?.external_details?.approval?.lastname?.trim()}`}
											</Typography>
										</Box>
										<Box>
											<Typography variant="body1" textAlign="center" sx={{ mt: 1 }}>Approved by</Typography>
										</Box>
									</Box>
								</Grid>
							</Grid>
						</Box>

						<Stack sx={{ mt: 8 }} spacing={3}>
							<Stack direction="row">
								<Box width={140}>
									<Typography variant="body1">Total Attendees</Typography>
								</Box>
								<Box width={30}>:</Box>
								<Box>
									<Typography variant="body1">{training?.trainees?.length} pax</Typography>
								</Box>
							</Stack>
							<Stack direction="row">
								<Box width={140}>
									<Typography variant="body1">Course Price</Typography>
								</Box>
								<Box width={30}>:</Box>
								<Box>
									<Typography variant="body1">{fCurrencyNumber(training?.external_details?.course_price) + '.00'} {training?.external_details?.currency}</Typography>
								</Box>
							</Stack>
							<Stack direction="row">
								<Box width={140}>
									<Typography variant="body1">Total Ammount</Typography>
								</Box>
								<Box width={30}>:</Box>
								<Box>
									<Typography variant="body1">{fCurrencyNumber(getTotalAmmount) + '.00'} {training?.external_details?.currency}</Typography>
								</Box>
							</Stack>
							<Stack direction="row">
								<Box width={140}>
									<Typography variant="body1">Date Requested</Typography>
								</Box>
								<Box width={30}>:</Box>
								<Box>
									<Typography variant="body1">{fDate(new Date(training?.external_details?.date_requested))}</Typography>
								</Box>
							</Stack>
						</Stack>
					</>
				)}

				<Box sx={{ mt: 10, mb: 2 }}>
					<Typography textAlign="center" variant="body2">&copy; FIAFI Group Company, 2022. All Rights Reserved.</Typography>
				</Box>
			</Card>
		</>
	);
}
