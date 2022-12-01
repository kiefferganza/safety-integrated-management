import PropTypes from 'prop-types';
import { Stack, Dialog, Button, TextField, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const CompanyNewEdit = ({
	title = 'Add Company',
	open,
	onClose,
	//
	onCreate,
	onUpdate,
	//
	company,
	onCompanyChanged,
	...other
}) => {

	return (
		<Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
			<DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

			<DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
				{(onCreate || onUpdate) && (
					<TextField
						fullWidth
						label="Company Name"
						value={company}
						onChange={onCompanyChanged}
						sx={{ mb: 3 }}
					/>
				)}
			</DialogContent>

			<DialogActions>
				{(onCreate || onUpdate) && (
					<Stack direction="row" justifyContent="flex-end" flexGrow={1}>
						<Button variant="soft" onClick={onCreate || onUpdate} disabled={!!!company}>
							{onUpdate ? 'Save' : 'Create'}
						</Button>
					</Stack>
				)}
			</DialogActions>
		</Dialog>
	)
}

CompanyNewEdit.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func,
	title: PropTypes.string,
	onCreate: PropTypes.func,
	onUpdate: PropTypes.func,
	company: PropTypes.string,
	onCompanyChanged: PropTypes.func,
};

export default CompanyNewEdit