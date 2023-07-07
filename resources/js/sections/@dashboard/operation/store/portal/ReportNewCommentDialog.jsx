import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Inertia } from '@inertiajs/inertia';
import { useSwal } from '@/hooks/useSwal';
// form
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Dialog, Button, DialogTitle, DialogContent, DialogActions, Checkbox, FormHelperText, FormControlLabel, Autocomplete, Chip, TextField } from '@mui/material';
// components
// import Iconify from '@/Components/iconify';
// import { MultiFilePreview, UploadBox } from '@/Components/upload';
import FormProvider from '@/Components/hook-form/FormProvider';
import { RHFSelect, RHFTextField } from '@/Components/hook-form';

// ----------------------------------------------------------------------

ReportNewCommentDialog.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func,
	title: PropTypes.string,
};

const newCommentSchema = Yup.object().shape({
	comment_code: Yup.string().required('Comment code is required'),
	pages: Yup.array().min(1, 'Please select atleast one page.').required(),
	comment: Yup.string().max(255).required('Please add a comment'),
});


const PAGES_DEF = Array(100).fill(null);

export default function ReportNewCommentDialog ({
	title = 'New Comment',
	open,
	onClose,
	inventoryReportId,
	...other
}) {
	const { load, stop } = useSwal();
	const [closeComment, setCloseComment] = useState(true);
	// const [file, setFile] = useState(null);
	const methods = useForm({
		resolver: yupResolver(newCommentSchema),
		defaultValues: {
			comment_code: "1"
		}
	});
	const { watch, setValue, handleSubmit, reset, formState: { errors } } = methods;
	const pagesVal = watch("pages");
	const commentCode = watch("comment_code");

	const postComment = (data) => {
		const newData = {
			...data,
			comment_code: +data.comment_code,
			pages: data.pages.join(","),
			status: closeComment && data.comment_code === "2" ? "closed" : "open"
			// src: file
		};
		Inertia.post(route("ppe.management.report.comment", inventoryReportId), newData, {
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
		// setFile(null);
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
					</Stack>
					{commentCode === "2" && (
						<FormControlLabel
							sx={{ mt: 1 }}
							control={
								<Checkbox
									checked={closeComment}
									onChange={() => {
										setCloseComment((currState) => !currState);
									}}
									label
								/>
							}
							label="Close Comment"
						/>
					)}
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
