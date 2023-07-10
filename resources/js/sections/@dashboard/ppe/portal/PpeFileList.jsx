import { fileFormat, fileThumb } from '@/Components/file-thumbnail';
import Scrollbar from '@/Components/scrollbar'
import { excerpt } from '@/utils/exercpt';
import { Dialog, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Link as MuiLink, Typography, Stack, Avatar, Box, Tooltip } from '@mui/material';

const PpeFileList = ({ title = "File List", open, onClose, files = [], ...other }) => {
	const { reviewer, approver } = files.reduce((acc, curr) => {
		console.log(acc.reviewer);
		if (curr.custom_properties.type === 'review') {
			acc.reviewer = [
				...acc.reviewer,
				{
					id: curr.id,
					name: curr.name,
					fileName: curr.file_name,
					url: curr.original_url
				}
			];
		}
		if (curr.custom_properties.type === 'approval') {
			acc.approver = [
				...acc.approver,
				{
					id: curr.id,
					name: curr.name,
					fileName: curr.file_name,
					url: curr.original_url
				}
			];
		}
		return acc;
	}, { reviewer: [], approver: [] });
	const current = files.at(-1) ? {
		id: files.at(-1).id,
		name: files.at(-1).name,
		fileName: files.at(-1).file_name,
		url: files.at(-1).original_url
	} : null;
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
										{current ? <FileLinkThumbnail {...current} /> : <Typography sx={{ color: "text.disabled" }}>No signed file yet.</Typography>}
									</TableCell>
									<TableCell align="left">
										{reviewer.length > 0 ? (
											reviewer.map((rev) => (
												<Stack spacing={1} key={rev.id}>
													<FileLinkThumbnail {...rev} />
												</Stack>
											))
										) : (
											<Typography sx={{ color: "text.disabled" }}>No signed file yet.</Typography>
										)}
									</TableCell>
									<TableCell align="left">
										{approver?.length ? (
											approver.map(app => (
												<Stack spacing={1} key={app.id}>
													<FileLinkThumbnail {...app} />
												</Stack>
											))
										) : (
											<Typography sx={{ color: "text.disabled" }}>No signed file yet.</Typography>
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

function FileLinkThumbnail ({ url, name, fileName }) {
	return (
		<Tooltip title={fileName}>
			<MuiLink
				component="a"
				href={url}
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
						<Box component="img" src={fileThumb(fileFormat(url))} sx={{ width: 24, height: 24 }} />
					</Avatar>

					<Stack spacing={0.5} flexGrow={1}>
						<Typography variant="subtitle2" sx={{ textDecoration: "none" }}>{excerpt(name || "", 24)}</Typography>
					</Stack>
				</Stack>
			</MuiLink>
		</Tooltip>
	)
}

export default PpeFileList;