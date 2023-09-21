import Label from "@/Components/label/Label";
import { Dialog, TextField, DialogActions, DialogContent, DialogTitle, Button, Stack, FormHelperText } from "@mui/material";
// components

const ShareDialog = (props) => {
	const { setType, setFirstname, setLastname, setPosition, open, onClose, action, title = "Generate Sharable Link", status, formNumber, ...other } = props;

	const handleOnClose = () => {
		onClose();
	}

	return (
		<Dialog open={open} onClose={handleOnClose} maxWidth="sm" fullWidth {...other}>
			<Stack direction="row" justifyContent="space-between">
				<DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
					{title}
					<FormHelperText>{formNumber}</FormHelperText>
				</DialogTitle>
				<DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
					<Label
						variant="soft"
						color={status.statusClass}
						sx={{ textTransform: "none" }}
					>
						{status.statusText}
					</Label>
				</DialogTitle>
			</Stack>
			<DialogContent sx={{ my: 2, overflow: 'visible' }}>
				<Stack gap={2}>
					<Stack gap={1} direction='row'>
						<TextField fullWidth label="First Name" onChange={(e) => { setFirstname(e.currentTarget.value) }} required />
						<TextField fullWidth label="Last Name" onChange={(e) => { setLastname(e.currentTarget.value) }} required />
						<TextField fullWidth label="Position" onChange={(e) => { setPosition(e.currentTarget.value) }} />
					</Stack>
					<Stack>
						<FormHelperText>Generate External Link for this document.</FormHelperText>
					</Stack>
				</Stack>
			</DialogContent>
			<DialogActions>
				{action}
				<Button variant="outlined" color="inherit" onClick={handleOnClose}>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ShareDialog;