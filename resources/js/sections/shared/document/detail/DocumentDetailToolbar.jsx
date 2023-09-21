import { useState } from 'react';
const { PDFDownloadLink, PDFViewer } = await import('@react-pdf/renderer');
// @mui
const { Box, Stack, Dialog, Tooltip, IconButton, DialogActions, CircularProgress } = await import('@mui/material');
// components
import Iconify from '@/Components/iconify';
import Label from '@/Components/label';
import { getDocumentReviewStatus } from '@/utils/formatStatuses';
import { DocumentPDF } from '@/sections/@dashboard/document/detail/DocumentPDF';

const DocumentDetailToolbar = ({ cms, document, latestUploadedFile, positions, status, rolloutDate }) => {
	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const docStatus = getDocumentReviewStatus(status);

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
						document={<DocumentPDF document={document} cms={cms} latestUploadedFile={latestUploadedFile} positions={positions} rolloutDate={rolloutDate} />}
						fileName={cms !== "N/A" ? cms : document.title}
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
				</Stack>
				<Label
					variant="soft"
					color={docStatus.statusClass}
					sx={{ textTransform: 'capitalize' }}
				>
					{docStatus.statusText}
				</Label>
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
							<DocumentPDF document={document} cms={cms} latestUploadedFile={latestUploadedFile} positions={positions} rolloutDate={rolloutDate} />
						</PDFViewer>
					</Box>
				</Box>
			</Dialog>
		</>
	);
}

export default DocumentDetailToolbar