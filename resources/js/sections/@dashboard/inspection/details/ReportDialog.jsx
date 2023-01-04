import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Iconify from '@/Components/iconify';
import ReportList from './ReportList';
import { Inertia } from '@inertiajs/inertia';


const ReportDialog = ({ open, onClose, inspection }) => {

	const handleViewFindings = () => {
		let url = "";
		if (inspection.type === "submitted") {
			url = `/dashboard/inspection/${inspection.id}/edit`;
		} else if (inspection.type === "review") {
			url = `/dashboard/inspection/${inspection.id}/review`;
		} else if (inspection.type === "verify") {
			url = `/dashboard/inspection/${inspection.id}/verify`;
		}
		onClose();
		Inertia.visit(url);
	}

	return (
		<Dialog
			open={open}
			onClose={onClose}
			scroll="paper"
			aria-labelledby="scroll-dialog-title"
			aria-describedby="scroll-dialog-description"
			fullWidth
			maxWidth="lg"
		>
			<DialogTitle id="scroll-dialog-title" sx={{ m: 0, p: 2 }}>
				Inspection Report
				<IconButton
					aria-label="close"
					onClick={onClose}
					sx={{
						position: 'absolute',
						right: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<Iconify icon="material-symbols:close" />
				</IconButton>
			</DialogTitle>
			<DialogContent dividers={scroll === 'paper'}>
				<DialogContentText
					id="scroll-dialog-description"
					tabIndex={-1}
				>
					<ReportList inspection={inspection} />
				</DialogContentText>
			</DialogContent>
			{inspection.status !== "closeout" && (
				<DialogActions sx={{ margin: "auto" }}>
					<Button
						onClick={handleViewFindings}
						variant="contained"
						endIcon={<Iconify icon="material-symbols:chevron-right" />}
					>View Findings</Button>
				</DialogActions>
			)}
		</Dialog>
	)
}

export default ReportDialog