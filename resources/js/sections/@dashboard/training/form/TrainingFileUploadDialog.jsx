import { useState, useCallback, useEffect } from 'react';
// @mui
import { Stack, Dialog, Button, DialogTitle, DialogContent, DialogActions } from '@mui/material';
// components
import { Upload } from '@/Components/upload';
import { useFormContext } from 'react-hook-form';

const TrainingFileUploadDialog = ({
	title = 'Upload Certificate',
	open,
	onClose,
	trainee,
	...other
}) => {
	const { setValue, watch } = useFormContext();

	const [tmpFile, setTmpFile] = useState([]);
	const trainees = watch("trainees");

	useEffect(() => {
		if (trainee?.src) {
			setTmpFile([trainee.src]);
		}
	}, [trainee]);

	const handleUpload = useCallback(
		(acceptedFiles) => {
			const file = acceptedFiles[0];

			const newFile = Object.assign(file, {
				preview: URL.createObjectURL(file),
			});

			if (file) {
				setTmpFile([newFile]);
			}
		},
		[setValue]);

	const handleRemoveFile = () => {
		setTmpFile([]);
	};

	const handleClose = () => {
		setTmpFile([]);
		onClose();
	}

	const handleUpdate = () => {
		const updatedTrainees = trainees?.map((tr) => {
			if (tr.emp_id == trainee?.emp_id) {
				return {
					fullname: trainee.fullname,
					position: trainee.position,
					emp_id: trainee.emp_id,
					user_id: trainee.user_id,
					src: tmpFile[0] || null
				}
				// 	{
				// 		"fullname": "Ayoub  Younis",
				// 		"position": "Safety Officer ",
				// 		"emp_id": 27,
				// 		"user_id": 1,
				// 		"src": null
				// }
			}
			return tr;
		});
		setValue('trainees', updatedTrainees);
	}

	return (
		<Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose} {...other}>
			<DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
				{title} for {trainee?.fullname}
			</DialogTitle>

			<DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
				<Upload multiple files={tmpFile} onDrop={handleUpload} onRemove={handleRemoveFile} />
			</DialogContent>

			<DialogActions>
				<Stack direction="row" justifyContent="flex-end" flexGrow={1} spacing={2}>
					<Button variant="soft" onClick={handleUpdate}>
						Save
					</Button>
					<Button variant="soft" onClick={handleClose}>
						Close
					</Button>
				</Stack>
			</DialogActions>
		</Dialog>
	)
}

export default TrainingFileUploadDialog