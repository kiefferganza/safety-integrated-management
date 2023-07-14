import { Button, Dialog, DialogContent, DialogTitle, Divider, FormHelperText, Stack, Typography } from "@mui/material";
import FormProvider from "@/Components/hook-form/FormProvider";
import { useForm } from "react-hook-form";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Inertia } from "@inertiajs/inertia";
import { useSwal } from "@/hooks/useSwal";
import { RHFRadioGroup, RHFTextField } from "@/Components/hook-form";
import { MultiFilePreview, UploadBox } from "@/Components/upload";
import Iconify from "@/Components/iconify/Iconify";
import { useCallback, useEffect } from "react";

const changeStatusSchema = Yup.object().shape({
	status: Yup.string().nullable(),
	remarks: Yup.string().nullable(),
	file: Yup.mixed().required('Please attached signed file.').test('file', 'Invalid file format', function (value) {
		if (!value) {
			// No file selected, validation passes
			return true;
		}

		// Check if the file meets your validation criteria
		const validFileTypes = ['image/jpeg', 'image/png', 'application/pdf'];
		if (!validFileTypes.includes(value.type)) {
			// Invalid file type, validation fails
			return false;
		}

		// File is valid, validation passes
		return true;
	}),
});


const STATUS_OPTIONS = [
	{ label: 'A.Approved', value: 'A' },
	{ label: 'B.SONO', value: 'B' },
	{ label: 'C.Fail / Not approved.', value: 'C' },
	{ label: 'D.Approved with comments', value: 'D' },
	{ label: 'E.NOWC: No Objection with comments', value: 'E' },
	{ label: 'F.Responded / Reviewed / Actioned', value: 'F' },
];

const ReportActionDialog = ({ open, onClose, submitText, actionInfo = {}, remarks = '', title = "Finish Review", status = "", type = "review", ...other }) => {
	const { load, stop } = useSwal();
	const defaultValues = {
		status,
		remarks,
		file: null
	};
	const methods = useForm({
		resolver: yupResolver(changeStatusSchema),
		defaultValues
	});
	const { handleSubmit, reset, watch, setValue, formState: { errors } } = methods;
	const { file } = watch();

	useEffect(() => {
		reset(defaultValues);
	}, [status, remarks]);

	const onSubmit = (data) => {
		const actionData = actionInfo?.data || {}
		Inertia.post(actionInfo?.routeName, {
			...data,
			status: type === "approval" ? status : data.status,
			type,
			...actionData
		}, {
			preserveScroll: true,
			onStart () {
				handleClose();
				load("Updating report", "please wait...");
			},
			onFinish () {
				stop();
			}
		});
	}

	const handleDrop = useCallback((acceptedFiles) => {
		const acceptedFile = acceptedFiles[0];

		if (acceptedFile) {
			setValue("file", acceptedFile, { shouldValidate: true });
		}
	}, []);

	const handleRemoveFile = () => {
		setValue('file', null, { shouldValidate: true });
	}

	const handleClose = () => {
		onClose();
		reset();
	}

	return (
		<Dialog fullWidth maxWidth="md" open={open} onClose={handleClose} {...other}>
			<Stack direction="row" justifyContent="space-between" alignItems="center">
				<DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>{title}</DialogTitle>
			</Stack>
			<DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
				<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
					<Stack spacing={2}>
						{type === "review" && (
							<div>
								<Typography variant="subtitle2">Status Code:</Typography>
								<RHFRadioGroup
									name="status"
									options={STATUS_OPTIONS}
									sx={{
										'& .MuiFormControlLabel-root': { mr: 4 },
									}}
								/>
							</div>
						)}
						<RHFTextField name="remarks" label="Remarks (Optional)" multiline rows={2} />
						<UploadBox
							onDrop={handleDrop}
							placeholder={
								<Stack spacing={0.5} alignItems="center">
									<Iconify icon="eva:cloud-upload-fill" width={40} />
									<Typography variant="body2">Upload file</Typography>
								</Stack>
							}
							sx={{ flexGrow: 1, height: 'auto', py: 2.5, mb: 3, width: 1 }}
						/>
						{file && <MultiFilePreview files={[file]} onRemove={handleRemoveFile} />}
						{!!errors?.file?.message && (
							<FormHelperText sx={{ marginLeft: "16px !important", marginTop: "0 !important" }} error>{errors?.file?.message}</FormHelperText>
						)}
					</Stack>
					<Divider sx={{ borderStyle: 'dashed', my: 1 }} />
					<Stack direction="row" justifyContent="end" spacing={2} sx={{ mb: 2 }}>
						<Button type="submit" variant="contained" >
							{submitText || "Save"}
						</Button>
						<Button color="error" onClick={handleClose} variant="contained">
							Cancel
						</Button>
					</Stack>
				</FormProvider>
			</DialogContent>
		</Dialog>
	)
}

export default ReportActionDialog