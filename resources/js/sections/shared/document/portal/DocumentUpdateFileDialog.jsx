import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Inertia } from '@inertiajs/inertia';
import { PATH_DASHBOARD } from '@/routes/paths';
import { useSwal } from '@/hooks/useSwal';
// form
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
const { Stack, Dialog, Button, DialogTitle, DialogContent, DialogActions, Typography, FormHelperText } = await import('@mui/material');
// components
import Iconify from '@/Components/iconify';
import { MultiFilePreview, UploadBox } from '@/Components/upload';
import FormProvider from '@/Components/hook-form/FormProvider';
import { RHFTextField } from '@/Components/hook-form';

// ----------------------------------------------------------------------
const approveFailSchema = Yup.object().shape({
	remarks: Yup.string(),
	file: Yup.string().required("Please attach a file for the document.")
});

export const DocumentUpdateFileDialog = ({
	title = 'Update File',
	open,
	onClose,
	documentId,
	updateFileInfo,
	...other
}) => {
	const { load, stop } = useSwal();
	const [file, setFile] = useState(null);
	const methods = useForm({
		resolver: yupResolver(approveFailSchema)
	});
	const { setValue, handleSubmit, reset, formState: { errors } } = methods;

	const handleDrop = useCallback(
		(acceptedFiles) => {
			const newFile = acceptedFiles[0];
			setFile(newFile);
			setValue("file", URL.createObjectURL(newFile), { shouldValidate: true });
		},
		[file]
	);

	const updateFile = (data) => {
		const newData = {
			...data,
			src: file,
		};
		Inertia.post(updateFileInfo, newData, {
			preserveScroll: true,
			onStart () {
				handleClose();
				load("Saving file", "please wait...");
			},
			onFinish () {
				stop();
			}
		});
	}

	const handleClose = () => {
		onClose();
		reset();
		setFile(null);
	}

	return (
		<Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose} {...other}>
			<Stack direction="row" justifyContent="space-between">
				<DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>{title}</DialogTitle>
			</Stack>

			<FormProvider methods={methods}>
				<DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
					<Stack spacing={2}>
						<RHFTextField name="remarks" label="Remarks (Optional)" multiline rows={2} />
						<UploadBox
							onDrop={handleDrop}
							placeholder={
								<Stack spacing={0.5} alignItems="center" sx={{ color: 'text.disabled' }}>
									<Iconify icon="eva:cloud-upload-fill" width={40} />
									<Typography variant="body2">{"Signed File"}</Typography>
								</Stack>
							}
							sx={{
								mb: 3,
								py: 2.5,
								width: 'auto',
								height: 'auto',
								borderRadius: 1.5,
							}}
							error={!!errors?.file?.message}
						/>
						{file && (
							<MultiFilePreview
								files={[file]}
								onRemove={() => {
									setValue("file", "", { shouldValidate: true });
									setFile(null);
								}}
							/>
						)}
						{!!errors?.file?.message && (
							<FormHelperText sx={{ marginLeft: "16px !important", marginTop: "0 !important" }} error>{errors?.file?.message}</FormHelperText>
						)}
					</Stack>
				</DialogContent>

				<DialogActions>
					<Stack direction="row" justifyContent="flex-end" flexGrow={1}>
						<Button variant="soft" onClick={handleSubmit(updateFile)}>
							Update
						</Button>
					</Stack>
				</DialogActions>
			</FormProvider>
		</Dialog>
	);
}

DocumentUpdateFileDialog.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func,
	title: PropTypes.string,
	documentId: PropTypes.number
};