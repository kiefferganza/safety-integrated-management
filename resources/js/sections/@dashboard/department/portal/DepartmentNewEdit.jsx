import PropTypes from 'prop-types';
import { Stack, Dialog, Button, TextField, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const DepartmentNewEdit = ({
	title = 'Add Department',
	open,
	onClose,
	//
	onCreate,
	onUpdate,
	//
	department,
	onDepartmentChanged,
	...other
}) => {

	return (
		<Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
			<DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

			<DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
				{(onCreate || onUpdate) && (
					<TextField fullWidth label="Department" value={department} onChange={onDepartmentChanged} sx={{ mb: 3 }} />
				)}
			</DialogContent>

			<DialogActions>
				{(onCreate || onUpdate) && (
					<Stack direction="row" justifyContent="flex-end" flexGrow={1}>
						<Button variant="soft" onClick={onCreate || onUpdate} disabled={!!!department}>
							{onUpdate ? 'Save' : 'Create'}
						</Button>
					</Stack>
				)}
			</DialogActions>
		</Dialog>
	)
}

DepartmentNewEdit.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func,
	title: PropTypes.string,
	onCreate: PropTypes.func,
	onUpdate: PropTypes.func,
	department: PropTypes.string,
	onDepartmentChanged: PropTypes.func,
};

export default DepartmentNewEdit