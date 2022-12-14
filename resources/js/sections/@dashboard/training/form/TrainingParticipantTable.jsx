// mui
import { Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
// Components
import Scrollbar from '@/Components/scrollbar/Scrollbar';
import Iconify from '@/Components/iconify';

const TrainingParticipantTable = ({ trainees, handleRemove }) => {

	return (
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


							<TableCell align="right"></TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{trainees.map((row, index) => (
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

								<TableCell align="right">
									<IconButton onClick={() => handleRemove({ employee_id: row.emp_id })}>
										<Iconify icon="eva:trash-2-outline" sx={{ color: 'error.main' }} />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Scrollbar>
		</TableContainer>
	)
}

export default TrainingParticipantTable