import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from 'react';
// @mui
import { Stack, Dialog, Button, TextField, DialogTitle, DialogContent, DialogActions } from '@mui/material';
// components
import Iconify from '@/Components/iconify';
import { Upload } from '@/Components/upload';

// ----------------------------------------------------------------------

FileNewFolderDialog.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func,
	title: PropTypes.string,
	onCreate: PropTypes.func,
	onUpdate: PropTypes.func,
	folderName: PropTypes.string,
	onChangeFolderName: PropTypes.func,
};

export default function FileNewFolderDialog ({
	title = 'Upload Files',
	open,
	onClose,
	//
	onCreate,
	onUpdate,
	//
	folderName,
	onChangeFolderName,
	...other
}) {

	return (
		<Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
			<DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

			<DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
				{(onCreate || onUpdate) && (
					<TextField fullWidth label="Folder name" value={folderName} onChange={onChangeFolderName} sx={{ mb: 3 }} />
				)}
			</DialogContent>

			<DialogActions>
				{(onCreate || onUpdate) && (
					<Stack direction="row" justifyContent="flex-end" flexGrow={1}>
						<Button variant="soft" onClick={onCreate || onUpdate}>
							{onUpdate ? 'Save' : 'Create'}
						</Button>
					</Stack>
				)}
			</DialogActions>
		</Dialog>
	);
}
