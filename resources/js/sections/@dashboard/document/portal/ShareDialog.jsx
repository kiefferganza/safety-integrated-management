import Label from "@/Components/label/Label";
import { Dialog, TextField, DialogActions, DialogContent, DialogTitle, Button, Stack, FormHelperText, RadioGroup, FormControlLabel, Radio } from "@mui/material";
// components

const ShareDialog = (props) => {
	const { type, setType, firstname, setFirstname, lastname, setLastname, reviewers = [], approver, open, onClose, action, title = "Generate Sharable Link", status, formNumber, ...other } = props;

	const handleOnClose = () => {
		onClose();
	}

	const handleTypeChange = (e) => {
		setType(e.target.value)
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
					</Stack>
					<RadioGroup sx={{ flexDirection: 'row' }} value={type} onChange={handleTypeChange}>
						<FormControlLabel control={<Radio />} value="reviewer" label="Reviewer" />
						<FormControlLabel control={<Radio />} value="approver" label="Approver" />
					</RadioGroup>
					<Stack>
						{type === "approver" ? (
							<FormHelperText>Generate Link for <strong>APPROVING</strong> this document.</FormHelperText>
						) : (
							<FormHelperText>Generate Link for <strong>REVIEWING</strong> this document.</FormHelperText>
						)}
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