import { fileFormat, fileThumb } from '@/Components/file-thumbnail';
import Scrollbar from '@/Components/scrollbar'
import { excerpt } from '@/utils/exercpt';
import { Dialog, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Link as MuiLink, Typography, Stack, Avatar, Box } from '@mui/material';

export const DocumentFileList = ({ title = "File List", open, onClose, document, ...other }) => {
	const { files, reviewer_employees, reviewer_sign, approval_employee, approval_sign } = document;

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
									<TableCell align="left">Current File</TableCell>

									<TableCell align="left">Reviewer's File</TableCell>

									<TableCell align="left">Verifier File</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								<TableRow>
									<TableCell align="left">
										<FileLinkThumbnail src={files ? files[0]?.src : ""} />
									</TableCell>
									<TableCell align="left">
										{reviewer_employees.length > 0 ? (
											reviewer_sign.length > 0 ? (
												reviewer_sign.map(revSign => (
													<Stack spacing={1} key={revSign.signed_doc_id}>
														<FileLinkThumbnail src={revSign?.src || ""} />
													</Stack>
												))
											) : (
												<Typography sx={{ color: "text.disabled" }}>No signed file yet.</Typography>
											)
										) : (
											<Typography sx={{ color: "text.disabled" }}>No reviewer assigned personel.</Typography>
										)}
									</TableCell>
									<TableCell align="left">
										{approval_employee ? (
											approval_sign ? (
												<FileLinkThumbnail src={approval_sign?.src || ""} />
											) : (
												<Typography sx={{ color: "text.disabled" }}>No signed file yet.</Typography>
											)
										) : (
											<Typography sx={{ color: "text.disabled" }}>No approval assigned personel.</Typography>
										)}
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</Scrollbar>
				</TableContainer>
			</DialogContent>
		</Dialog>
	)
}

function FileLinkThumbnail ({ src }) {
	return (
		<MuiLink
			component="a"
			href={`/storage/media/docs/${src}`}
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
					<Box component="img" src={fileThumb(fileFormat(src))} sx={{ width: 24, height: 24 }} />
				</Avatar>

				<Stack spacing={0.5} flexGrow={1}>
					<Typography variant="subtitle2" sx={{ textDecoration: "none" }}>{excerpt(src || "", 24)}</Typography>
				</Stack>
			</Stack>
		</MuiLink>
	)
}