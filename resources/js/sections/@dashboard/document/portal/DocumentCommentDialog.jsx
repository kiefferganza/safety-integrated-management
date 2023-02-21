import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Inertia } from '@inertiajs/inertia';
import { PATH_DASHBOARD } from '@/routes/paths';
import { useSwal } from '@/hooks/useSwal';
// form
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
const { Stack, Dialog, Button, DialogTitle, DialogContent, DialogActions, Typography, FormHelperText, Autocomplete, Chip, TextField } = await import('@mui/material');
// components
import Iconify from '@/Components/iconify';
import { MultiFilePreview, UploadBox } from '@/Components/upload';
import FormProvider from '@/Components/hook-form/FormProvider';
import { RHFSelect, RHFTextField } from '@/Components/hook-form';

// ----------------------------------------------------------------------

DocumentCommentDialog.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func,
	title: PropTypes.string,
};

const newCommentSchema = Yup.object().shape({
	comment_code: Yup.string().required('Comment code is required'),
	pages: Yup.array().min(1, 'Please select atleast one page.').required(),
	comment: Yup.string().required('Please add a comment'),
	file: Yup.string().required("Please attach a file for the document.")
});


const PAGES_DEF = Array(100).fill(null);

export function DocumentCommentDialog ({
	title = 'New Comment',
	open,
	onClose,
	documentId,
	...other
}) {
	const { load, stop } = useSwal();
	const [file, setFile] = useState(null);
	const methods = useForm({
		resolver: yupResolver(newCommentSchema)
	});
	const { watch, setValue, handleSubmit, reset, formState: { errors } } = methods;
	const pagesVal = watch("pages");

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
			pages: data.pages.join(","),
			src: file
		};
		Inertia.post(PATH_DASHBOARD.fileManager.addComment(documentId), newData, {
			preserveScroll: true,
			onStart () {
				handleClose();
				load("Posting comment", "please wait...");
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

	const pagesItems = useMemo(() => PAGES_DEF.map((_, idx) => `page ${idx + 1}`));
	return (
		<Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose} {...other}>
			<DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

			<FormProvider methods={methods}>
				<DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
					<Stack spacing={2}>
						<RHFSelect name="comment_code" label="Comment Code">
							<option value=""></option>
							<option value="1">1</option>
							<option value="2">2</option>
						</RHFSelect>
						<FormHelperText sx={{ marginLeft: "16px !important", marginTop: "0 !important" }}>1 = action required on this issue, 2 = advisory comment</FormHelperText>
						<Autocomplete
							multiple
							freeSolo
							fullWidth
							value={pagesVal || []}
							onChange={(_event, newValue) => {
								if (newValue) {
									setValue("pages", newValue, { shouldValidate: true });
								} else {
									setValue("pages", [], { shouldValidate: true });
								}
							}}
							options={pagesItems}
							renderTags={(value, getTagProps) =>
								value.map((option, index) => (
									<Chip {...getTagProps({ index })} key={index} size="small" label={option?.label || option} />
								))
							}
							renderInput={(params) => <TextField label="Comment Page" {...params} fullWidth error={!!errors?.pages?.message} helperText={errors?.pages?.message} />}
						/>
						<RHFTextField name="comment" label="Brief Comment" multiline rows={2} />
						<UploadBox
							onDrop={handleDrop}
							placeholder={
								<Stack spacing={0.5} alignItems="center" sx={{ color: 'text.disabled' }}>
									<Iconify icon="eva:cloud-upload-fill" width={40} />
									<Typography variant="body2">Upload file</Typography>
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
							Post
						</Button>
					</Stack>
				</DialogActions>
			</FormProvider>
		</Dialog>
	);
}
