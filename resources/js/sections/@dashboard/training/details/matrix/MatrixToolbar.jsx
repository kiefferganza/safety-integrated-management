import { useState } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
// @mui
import { Box, Stack, Dialog, Tooltip, IconButton, DialogActions, CircularProgress } from '@mui/material';
// components
import Iconify from '@/Components/iconify';
import MatrixPDF from './MatrixPDF';
//

// ----------------------------------------------------------------------

export default function MatrixToolbar ({ titles, years, selectedYear }) {
	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Stack
				spacing={2}
				direction={{ xs: 'column', sm: 'row' }}
				justifyContent="space-between"
				alignItems={{ sm: 'center' }}
				sx={{ mb: 5 }}
			>
				<Stack direction="row" spacing={1}>
					<Tooltip title="View">
						<IconButton onClick={handleOpen}>
							<Iconify icon="eva:eye-fill" />
						</IconButton>
					</Tooltip>

					<PDFDownloadLink
						document={<MatrixPDF selectedYear={selectedYear} titles={titles} years={years} />}
						fileName={'training matrix'}
						style={{ textDecoration: 'none' }}
					>
						{({ loading }) => (
							<Tooltip title="Download">
								<IconButton>
									{loading ? <CircularProgress size={24} color="inherit" /> : <Iconify icon="eva:download-fill" />}
								</IconButton>
							</Tooltip>
						)}
					</PDFDownloadLink>
				</Stack>
			</Stack>

			<Dialog fullScreen open={open}>
				<Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
					<DialogActions
						sx={{
							zIndex: 9,
							padding: '12px !important',
							boxShadow: (theme) => theme.customShadows.z8,
						}}
					>
						<Tooltip title="Close">
							<IconButton color="inherit" onClick={handleClose}>
								<Iconify icon="eva:close-fill" />
							</IconButton>
						</Tooltip>
					</DialogActions>

					<Box sx={{ flexGrow: 1, height: '100%', overflow: 'hidden' }}>
						<PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
							<MatrixPDF selectedYear={selectedYear} titles={titles} years={years} />
						</PDFViewer>
					</Box>
				</Box>
			</Dialog>
		</>
	);
}
