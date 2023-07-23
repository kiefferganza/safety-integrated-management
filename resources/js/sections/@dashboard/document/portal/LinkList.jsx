import Iconify from '@/Components/iconify/Iconify';
import Label from '@/Components/label/Label';
import Scrollbar from '@/Components/scrollbar'
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import { ellipsis } from '@/utils/exercpt';
import { Button, Dialog, DialogContent, DialogTitle, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import { differenceInMilliseconds } from 'date-fns';
import { useSnackbar } from 'notistack';

const CURRENT_DATE = new Date();
export const LinkList = ({ title = "External Link List", open, onClose, shareable_link = [], external_approver = [], ...other }) => {

	const { copy } = useCopyToClipboard();
	const { enqueueSnackbar } = useSnackbar()

	const handleCopy = (url) => {
		copy(url);
		enqueueSnackbar("URL copied successfully");
	}

	return (
		<Dialog fullWidth maxWidth="lg" open={open} onClose={onClose} {...other}>
			<DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>{title}</DialogTitle>
			<DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
				<TableContainer sx={{ overflow: 'unset' }}>
					<Scrollbar>
						<Table>
							<TableHead
								sx={{
									borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
									'& th': { backgroundColor: 'transparent' },
								}}
							>
								<TableRow>
									<TableCell align="left">Name</TableCell>

									<TableCell align="left">Link</TableCell>

									<TableCell align="left">Expiration Date</TableCell>

									<TableCell align="left">Refresh Expiration</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{shareable_link.map(link => {
									const id = link.custom_properties?.id;
									let personel;
									personel = external_approver.find(rev => rev.id === id);
									const differenceInMs = differenceInMilliseconds(new Date(link.expiration_date), CURRENT_DATE);
									const remainingDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
									const remainingHours = Math.floor((differenceInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
									return (
										<TableRow key={link.id}>
											<TableCell align="left">
												{personel?.firstname} {personel?.lastname}
											</TableCell>

											<TableCell align="left">
												<Stack direction="row" gap={1} alignItems="center">
													<Tooltip title={link.url}>
														<Typography variant="subtitle2">{ellipsis(link.url, 36)}</Typography>
													</Tooltip>
													<Tooltip title="Copy">
														<IconButton onClick={() => handleCopy(link.url)}>
															<Iconify icon="bx:copy" />
														</IconButton>
													</Tooltip>
												</Stack>
											</TableCell>
											<TableCell align="left">
												<Label color="error">
													{remainingHours === 0 ? (
														`${remainingDays} days`
													) : (
														`${remainingDays} days and ${remainingHours} hours`
													)}
												</Label>
											</TableCell>
											<TableCell align="left">
												<Button variant="contained" size="small">Refresh Exipration Date</Button>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</Scrollbar>
				</TableContainer>
			</DialogContent>
		</Dialog>
	)
}