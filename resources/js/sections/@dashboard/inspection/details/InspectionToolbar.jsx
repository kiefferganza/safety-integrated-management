import PropTypes from 'prop-types';
import { useState } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
// @mui
import { Box, Stack, Dialog, Tooltip, IconButton, DialogActions, CircularProgress } from '@mui/material';
// components
import Iconify from '@/Components/iconify';
import Label from '@/Components/label';
//
import InspectionPDFStyle from './InspectionPDF';

// ----------------------------------------------------------------------

InspectionToolbar.propTypes = {
	inspection: PropTypes.object,
	cms: PropTypes.string
};

export default function InspectionToolbar ({ inspection, cms, reports, findings, rolloutDate }) {
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
						document={<InspectionPDFStyle inspection={inspection} reports={reports} cms={cms} findings={findings} rolloutDate={rolloutDate} />}
						fileName={cms !== "N/A" ? cms : "Toolbox Talk"}
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

					<Tooltip title="Print">
						<IconButton onClick={handleOpen}>
							<Iconify icon="eva:printer-fill" />
						</IconButton>
					</Tooltip>

					<Tooltip title="Send">
						<IconButton>
							<Iconify icon="ic:round-send" />
						</IconButton>
					</Tooltip>

					<Tooltip title="Share">
						<IconButton>
							<Iconify icon="eva:share-fill" />
						</IconButton>
					</Tooltip>
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
							<InspectionPDFStyle inspection={inspection} reports={reports} cms={cms} findings={findings} rolloutDate={rolloutDate} />
						</PDFViewer>
					</Box>
				</Box>
			</Dialog>
		</>
	);
}
