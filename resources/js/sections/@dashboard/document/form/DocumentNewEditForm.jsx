import { useState, useEffect, useCallback } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Box, Stack, Typography, Divider, TextField, Autocomplete, Chip } from '@mui/material';
// components
import FormProvider, { RHFTextField } from '@/Components/hook-form';
import { Inertia } from '@inertiajs/inertia';
import { useSwal } from '@/hooks/useSwal';
import { MultiFilePreview, Upload } from '@/Components/upload';
import { PATH_DASHBOARD } from '@/routes/paths';

const DocumentNewEditForm = ({ currentDocument, isEdit }) => {
	const { load, stop } = useSwal();
	const [cc, setCC] = useState([]);
	const [file, setFile] = useState([]);
	const { errors: resErrors, folder, sequence_no, personel } = usePage().props;


	const newDocumentSchema = Yup.object().shape({
		project_code: Yup.string().required('Project Code is required'),
		originator: Yup.string().required('Originator is required'),
		discipline: Yup.string().required('Discipline is required'),
		document_type: Yup.string().required('Project Type is required'),
		title: Yup.string().required(),
		src: isEdit ? Yup.string().notRequired() : Yup.string().required("Please attach a file for the document."),
		reviewers: Yup.array().test('isRequired', 'Please select either reviewer or approval personel', function (item) {
			if (isEdit) return true;
			if (this.parent.approval_id === "" && item.length === 0) return false;
			return true;
		}),
		approval_id: Yup.string().when("reviewers", (reviewers, schema) => reviewers.length > 0 ? schema.notRequired() : schema.required('Please select either reviewer or approval personel')),
		external_approver: Yup.array().when([], {
			is: () => currentDocument?.external_approver && currentDocument?.external_approver?.length > 0,
			then: Yup.array().of(
				Yup.object().shape({
					firstname: Yup.string().required("First name is required"),
					lastname: Yup.string().required("Last name is required"),
					position: Yup.string().required("Position is required")
				})
			),
			otherwise: Yup.array()
		})
	});

	const defaultValues = {
		sequence_no: currentDocument?.sequence_no || sequence_no || '',
		project_code: currentDocument?.project_code || '',
		originator: currentDocument?.originator || '',
		discipline: currentDocument?.discipline || '',
		document_type: currentDocument?.document_type || '',
		document_zone: currentDocument?.document_zone || '',
		document_level: currentDocument?.document_level || '',
		title: currentDocument?.title || '',
		description: currentDocument?.description || '',
		approval_id: currentDocument?.approval_id || '',
		src: '',
		reviewers: currentDocument?.reviewer_employees ? currentDocument?.reviewer_employees.map(rev => ({ id: rev.employee_id, label: rev.fullname, user_id: rev.user_id })) : [],
		external_approver: currentDocument?.external_approver && currentDocument?.external_approver?.length > 0 ? currentDocument.external_approver : []
	};

	const methods = useForm({
		resolver: yupResolver(newDocumentSchema),
		defaultValues,
	});

	const { watch, handleSubmit, setValue, setError, reset, formState: { errors, isDirty } } = methods;
	const values = watch();

	useEffect(() => {
		if (Object.keys(resErrors).length !== 0) {
			for (const key in resErrors) {
				setError(key, { type: "custom", message: resErrors[key] });
			}
		} else {
			reset(defaultValues);
			setFile(isEdit && currentDocument ? [currentDocument?.file?.src] : []);
		}
	}, [resErrors, sequence_no]);

	const handleDropSingleFile = useCallback((acceptedFiles) => {
		const file = acceptedFiles[0];

		if (file) {
			setValue("src", URL.createObjectURL(file), { shouldValidate: true });
			setFile([Object.assign(file, {
				preview: URL.createObjectURL(file),
			})]);
		}
	}, []);

	const handleRemoveFile = () => {
		setValue("src", "", { shouldValidate: true });
		setFile([]);
	}

	const onSubmit = (data) => {
		if (file.length !== 1) return;
		if (!isEdit) {
			data.src = file[0];
			Inertia.post(PATH_DASHBOARD.fileManager.newDocument(folder.folder_id), data, {
				preserveScroll: true,
				onStart () {
					load("Creating new document.", "please wait...");
				},
				onFinish () {
					reset();
					setFile([]);
					stop();
				}
			});
		} else {
			data.src = file[0];
			Inertia.put(route('files.management.document.update', { folder: folder.folder_id, document: currentDocument.document_id }), data, {
				preserveScroll: true,
				onStart () {
					load("Updating document.", "please wait...");
				},
				onFinish () {
					// reset();
					// setFile([]);
					stop();
				}
			});
		}
	}

	const getAutocompleteValue = (id) => {
		const findPerson = personel.find(per => per.employee_id == id);
		if (findPerson) {
			return findPerson?.fullname;
		}
		return null;
	}

	const options = personel.map((option) => ({ id: option.employee_id, label: option.fullname, user_id: option.user_id }));

	return (
		<FormProvider methods={methods}>
			<Card sx={{ p: 3 }}>
				<Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
					<Stack spacing={3}>
						<Typography variant="h6" sx={{ color: 'text.disabled' }}>
							Project Detail
						</Typography>
						<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>

							<RHFTextField
								name="project_code"
								label="Project Code"
								inputProps={{
									sx: { textTransform: "uppercase" }
								}}
							/>

							<RHFTextField name="originator" label="Originator" />

							<RHFTextField name="discipline" label="Discipline" />

						</Stack>
						<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>

							<RHFTextField name="document_type" label="Type" />

							<RHFTextField name="document_zone" label="Zone (Optional)" />

							<RHFTextField name="document_level" label="Level (Optional)" />

						</Stack>
						<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>

							<RHFTextField disabled name="sequence_no" label="Sequence No." />

							<Box width={1} />
							<Box width={1} />

						</Stack>
					</Stack>


					<Stack spacing={3}>
						<Typography variant="h6" sx={{ color: 'text.disabled' }}>
							Document Detail
						</Typography>
						<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
							<RHFTextField name="title" label="Document Title" />
							<RHFTextField name="description" label="Description (Optional)" />
							<Box width={1} />
						</Stack>
						{!isEdit && (
							<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
								<PersonelAutocomplete
									value={values.reviewers || []}
									multiple
									disabled={isEdit ? !(currentDocument?.status === '0') : false}
									onChange={(_event, newValue) => {
										if (newValue) {
											setValue('reviewers', newValue, { shouldValidate: true, shouldDirty: true });
										} else {
											setValue('reviewers', [], { shouldValidate: true, shouldDirty: true });
										}
									}}
									options={options}
									isOptionEqualToValue={(option, value) => option.id === value.id}
									label="Reviewer Personel"
									renderTags={(value, getTagProps) =>
										value.map((option, index) => (
											<Chip {...getTagProps({ index })} key={index} size="small" label={option?.label || option} />
										))
									}
									error={errors?.reviewers?.message}
								/>
								<PersonelAutocomplete
									value={getAutocompleteValue(values.approval_id)}
									onChange={(_event, newValue) => {
										if (newValue) {
											setValue('approval_id', newValue.id, { shouldValidate: true, shouldDirty: true });
										} else {
											setValue('approval_id', '', { shouldValidate: true, shouldDirty: true });
										}
									}}
									disabled={isEdit ? !(currentDocument?.status === '0') : false}
									isOptionEqualToValue={(option, value) => option.label === value}
									options={options}
									label="Approval Personel"
									error={errors?.approval_id?.message}
								/>
								<Autocomplete
									multiple
									freeSolo
									fullWidth
									value={cc}
									onChange={(_event, newValue) => {
										setCC(newValue);
									}}
									options={options}
									renderOption={(props, option) => {
										return (
											<li {...props} key={props.id}>
												{option.label}
											</li>
										);
									}}
									renderTags={(value, getTagProps) =>
										value.map((option, index) => (
											<Chip {...getTagProps({ index })} key={index} size="small" label={option?.label || option} />
										))
									}
									renderInput={(params) => <TextField label="Add CC" {...params} fullWidth />}
								/>
							</Stack>
						)}
					</Stack>

					{isEdit && currentDocument?.external_approver?.length > 0 && (
						<Stack spacing={3}>
							<Typography variant="h6" sx={{ color: 'text.disabled' }}>
								External Approver
							</Typography>
							{currentDocument.external_approver.map((approver, index) => (
								<Stack key={approver.id} direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
									<RHFTextField name={`external_approver[${index}].firstname`} label="First name" />
									<RHFTextField name={`external_approver[${index}].lastname`} label="Last name" />
									<RHFTextField name={`external_approver[${index}].position`} label="Position" />
								</Stack>
							))}
						</Stack>
					)}


					{!isEdit && (
						<Stack spacing={3}>
							<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: 1 }}>
								<Box width={1}>
									<Typography variant="h6" sx={{ color: 'text.disabled' }}>
										Attached File
									</Typography>
									<Upload error={!!errors?.src?.message} helperText={errors?.src?.message} file={file[0] || null} onDrop={handleDropSingleFile} />
									<MultiFilePreview files={file} onRemove={handleRemoveFile} />
								</Box>
							</Stack>
						</Stack>
					)}

				</Stack>
			</Card>
			<Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
				<LoadingButton
					size="large"
					variant="contained"
					onClick={handleSubmit(onSubmit)}
					disabled={isEdit ? !isDirty : false}
				>
					{isEdit ? "Update" : "Create"}
				</LoadingButton>
			</Stack>
		</FormProvider>
	)
}

function PersonelAutocomplete ({ value, onChange, options, label, error = "", ...others }) {
	return (
		<Autocomplete
			fullWidth
			value={value}
			onChange={onChange}
			options={options}
			renderOption={(props, option) => {
				return (
					<li {...props} key={props.id}>
						{option.label}
					</li>
				);
			}}
			renderInput={(params) => <TextField label={label} {...params} error={!!error} helperText={error} />}
			{...others}
		/>
	)
}


export default DocumentNewEditForm