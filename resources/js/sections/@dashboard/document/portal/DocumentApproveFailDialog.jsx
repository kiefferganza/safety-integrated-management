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
const STATUSES = [
	{ label: "A. Approved", code: "A" },
	{ label: "B. SONO", code: "B" },
	{ label: "C. Fail / Not approved", code: "C" },
	{ label: "D. Approved with comments", code: "D" },
	{ label: "E. NOWC: No Objection with comments", code: "E" },
	{ label: "F. Responded / Reviewed / Actioned", code: "F" },
];

const approveFailSchema = Yup.object().shape({
	remarks: Yup.string(),
	file: Yup.string().required("Please attach a file for the document.")
});

export const DocumentApproveFailDialog = ({
	title = 'Action',
	open,
	onClose,
	documentId,
	selectedStatus,
	docType,
	actionResponseId,
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

	const postComment = (data) => {
		const newData = {
			...data,
			src: file,
			docType,
			status: selectedStatus
		};
		if (actionResponseId) {
			newData.response_id = actionResponseId;
		}
		Inertia.post(PATH_DASHBOARD.fileManager.actionDocument(documentId), newData, {
			preserveScroll: true,
			onStart () {
				handleClose();
				load("Saving status", "please wait...");
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
				<DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>{STATUSES?.find(s => s.code === selectedStatus)?.label}</DialogTitle>
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
									<Typography variant="body2">{!actionResponseId ? "Signed File" : "Upload file"}</Typography>
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
						<Button variant="soft" onClick={handleSubmit(postComment)}>
							Update
						</Button>
					</Stack>
				</DialogActions>
			</FormProvider>
		</Dialog>
	);
}

DocumentApproveFailDialog.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func,
	title: PropTypes.string,
	selectedStatus: PropTypes.string,
	docType: PropTypes.string,
	documentId: PropTypes.number,
};