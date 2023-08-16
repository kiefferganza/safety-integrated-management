import { useState } from 'react';
import Iconify from '@/Components/iconify/Iconify';
import Label from '@/Components/label/Label';
import Scrollbar from '@/Components/scrollbar'
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import { useSwal } from '@/hooks/useSwal';
import { ellipsis } from '@/utils/exercpt';
import { Inertia } from '@inertiajs/inertia';
import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogContent, DialogTitle, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import { differenceInDays, differenceInHours, parseISO } from 'date-fns';
import { useSnackbar } from 'notistack';
import ConfirmDialog from '@/Components/confirm-dialog/ConfirmDialog';

const CURRENT_DATE = new Date();
export const LinkList = ({ title = "External Link List", open, onClose, shareable_link = [], external_approver = [], ...other }) => {
	const { load, stop } = useSwal();

	const [selectedId, setSelectedId] = useState(null);
	const [loading, setLoading] = useState(false);
	const [openConfirm, setOpenConfirm] = useState(false);
	const { copy } = useCopyToClipboard();
	const { enqueueSnackbar } = useSnackbar();

	const handleOpenConfirm = (id) => {
		setSelectedId(id);
		setOpenConfirm(true);
	};

	const handleCloseConfirm = () => {
		setSelectedId(null);
		setOpenConfirm(false);
	};

	const handleDelete = () => {
		handleCloseConfirm();
		const selectedLink = shareable_link.find(link => link.id === selectedId);
		if (selectedLink) {
			Inertia.post(route('shared.document.deleteSharedLink', {
				shareableLink: selectedLink.id,
				_query: {
					token: selectedLink.token
				}
			}), {}, {
				preserveScroll: true,
				onStart () {
					load('Deleting shared link', 'please wait...');
				},
				onFinish () {
					onClose();
					stop();
				}
			})
		}
	}

	const handleCopy = (url) => {
		copy(url);
		enqueueSnackbar("URL copied successfully");
	}

	const handleRefresh = async ({ id, token }) => {
		Inertia.post(route('shared.document.refreshExpiration', {
			shareableLink: id,
			_query: {
				token
			}
		}), {}, {
			preserveScroll: true,
			preserverState: true,
			onStart () {
				setLoading(true);
			},
			onFinish () {
				setLoading(false);
			}
		})
	}

	return (
		<>
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

										<TableCell align="left">Position</TableCell>

										<TableCell align="left">Link</TableCell>

										<TableCell align="left">Expiration Date</TableCell>

										<TableCell align="left">Action</TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									{shareable_link.map(link => {
										const id = link.custom_properties?.id;
										let personel;
										personel = external_approver.find(rev => rev.id === id);
										let expiryText = 'Expired';
										const parsedDate = parseISO(link.expiration_date);

										if (parsedDate < CURRENT_DATE) {
											expiryText = 'Expired';
										} else {
											const daysDifference = differenceInDays(parsedDate, CURRENT_DATE);
											const hoursDifference = differenceInHours(parsedDate, CURRENT_DATE) % 24;

											if (daysDifference === 0 && hoursDifference === 0) {
												expiryText = 'Expired';
											} else if (daysDifference === 0) {
												expiryText = `Expires in ${hoursDifference} hours`;
											} else if (hoursDifference === 0) {
												expiryText = `Expires in ${daysDifference} days`;
											} else {
												expiryText = `Expires in ${daysDifference} days and ${hoursDifference} hours`;
											}
										}
										return (
											<TableRow key={link.id}>
												<TableCell align="left">
													{personel?.firstname} {personel?.lastname}
												</TableCell>

												<TableCell align="left">
													{personel?.position || 'NA'}
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
														{expiryText}
													</Label>
												</TableCell>
												<TableCell align="left">
													<Stack direction="row" gap={1}>
														<LoadingButton loading={loading} onClick={() => handleRefresh({ id: link.id, token: link.token })} variant="contained" size="small">Refresh Exipration Date</LoadingButton>
														<Button onClick={() => handleOpenConfirm(link.id)} variant="contained" size="small" color="error">Delete</Button>
													</Stack>
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
			<ConfirmDialog
				open={openConfirm}
				onClose={handleCloseConfirm}
				title="Delete"
				content="Are you sure want to delete?"
				action={
					<Button variant="contained" color="error" onClick={handleDelete}>
						Delete
					</Button>
				}
			/>

		</>
	)
}