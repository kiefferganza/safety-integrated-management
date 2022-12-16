import { useState } from 'react';
// mui
import { Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
// Components
import Scrollbar from '@/Components/scrollbar/Scrollbar';
import Iconify from '@/Components/iconify';
import TrainingFileUploadDialog from './TrainingFileUploadDialog';

const TrainingParticipantTable = ({ trainees, handleRemove }) => {
	const [openUploadFile, setOpenUploadFile] = useState(false);
	const [selectedTrainee, setSelectedTrainee] = useState(null);

	const handleOpenUploadFile = (trainee) => {
		setSelectedTrainee(trainee);
		setOpenUploadFile(true);
	};

	const handleCloseUploadFile = () => {
		setSelectedTrainee(null);
		setOpenUploadFile(false);
	};


	return (
		<>
			<TableContainer sx={{ overflow: 'unset' }}>
				<Scrollbar>
					<Table sx={{ minWidth: 960 }}>
						<TableHead
							sx={{
								borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
								'& th': { backgroundColor: 'transparent' },
							}}
						>
							<TableRow>
								<TableCell width={40}>#</TableCell>

								<TableCell align="center">Name</TableCell>

								<TableCell align="center">Position</TableCell>

								<TableCell align="center">Certificate</TableCell>

								<TableCell align="right"></TableCell>

							</TableRow>
						</TableHead>

						<TableBody>
							{trainees.map((row, index) => {
								return (
									<TableRow
										key={index}
										sx={{
											borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
										}}
									>
										<TableCell>{index + 1}</TableCell>

										<TableCell align="center">
											<Box sx={{ maxWidth: 560 }}>
												<Typography variant="subtitle2">{row.fullname}</Typography>

												<Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
													{row.description}
												</Typography>
											</Box>
										</TableCell>

										<TableCell align="center">{row.position}</TableCell>

										<TableCell align="center">
											<Button
												variant="outlined"
												startIcon={<Iconify icon="eva:cloud-upload-fill" />}
												onClick={() => handleOpenUploadFile(row)}
												color="primary"

											>
												{row?.src ? "Update Certificate" : "Upload"}
											</Button>
										</TableCell>

										<TableCell align="right">
											<IconButton onClick={() => handleRemove({ employee_id: row.emp_id })}>
												<Iconify icon="eva:trash-2-outline" sx={{ color: 'error.main' }} />
											</IconButton>
										</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</Scrollbar>
			</TableContainer>
			<TrainingFileUploadDialog
				open={openUploadFile}
				onClose={handleCloseUploadFile}
				trainee={selectedTrainee}
			/>
		</>
	)
}

export default TrainingParticipantTable