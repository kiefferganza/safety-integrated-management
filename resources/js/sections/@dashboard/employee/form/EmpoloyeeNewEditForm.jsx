import { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, TextField, Autocomplete } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
// utils
import { fData } from '@/utils/formatNumber';
import { PATH_DASHBOARD } from '@/routes/paths';
import { getCurrentUserImage } from '@/utils/formatName';
import { countries } from '@/assets/data';
// components
import Label from '@/Components/label';
import FormProvider, { RHFPhone, RHFRadioGroup, RHFSelect, RHFTextField, RHFUploadAvatar } from '@/Components/hook-form';

import { Inertia } from '@inertiajs/inertia';
import { format } from 'date-fns';
import _ from 'lodash';
import { usePage } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

EmpoloyeeNewEditForm.propTypes = {
	currentEmployee: PropTypes.object,
	departments: PropTypes.array,
	positions: PropTypes.array
};

export default function EmpoloyeeNewEditForm ({ companies, departments, positions, currentEmployee, users, isEdit = false }) {
	const { errors: resErrors } = usePage().props;


	const NewUserSchema = Yup.object().shape({
		firstname: Yup.string().required('First name is required'),
		middlename: Yup.string(),
		lastname: Yup.string().required('Last name is required'),
		email: Yup.string().required('Email is required').email(),
		phone_no: Yup.string().required('Phone number is required'),
		company: Yup.string().required('Company is required'),
		company_type: Yup.string().required('Company type is required'),
		position: Yup.string().required('Position is required'),
		department: Yup.string().required('Department is required'),
		birth_date: Yup.string().required('Date of birth is required'),
		about: Yup.string().max(255, "About must not exceed 255 characters")
	});

	const defaultValues = {
		firstname: currentEmployee?.firstname || '',
		middlename: currentEmployee?.middlename?.trim() || '',
		lastname: currentEmployee?.lastname || '',
		email: currentEmployee?.email || '',
		phone_no: currentEmployee?.phone_no || '',
		company: currentEmployee?.company || '',
		company_type: currentEmployee?.company_type || '',
		position: currentEmployee?.position || '',
		department: currentEmployee?.department || '',
		country: currentEmployee?.country || '',
		img_src: currentEmployee?.img_src ? getCurrentUserImage(currentEmployee) : '',
		birth_date: currentEmployee?.birth_date || '',
		sex: currentEmployee?.sex || 'Male',
		about: currentEmployee?.about || '',
		is_active: currentEmployee?.is_active
	};

	const methods = useForm({
		resolver: yupResolver(NewUserSchema),
		defaultValues,
	});

	const {
		watch,
		control,
		setValue,
		handleSubmit,
		reset,
		setError,
		formState: { isSubmitting },
	} = methods;

	const values = watch();

	useEffect(() => {
		if (Object.keys(resErrors).length !== 0) {
			for (const key in resErrors) {
				setError(key, { type: "custom", message: resErrors[key] });
			}
		}
	}, [resErrors]);

	const handleAutocompleteName = (_, val) => {
		if (val) {
			const user = users.find(user => `${user.firstname} ${user.lastname}`.toLowerCase() === val.toLowerCase());
			console.log(user);
			setValue("firstname", user.firstname);
			setValue("lastname", user.lastname);
			setValue("email", user.email);
			setValue("position", user.position || "");
		} else {
			reset({ firstname: "", lastname: "", position: "", email: "" });
		}
	}

	const handleFirstnameChange = (e, val) => {
		if (e?.type === "change") {
			setValue("firstname", val);
		}
	}

	const onSubmit = async () => {
		try {
			Inertia.post(
				isEdit ? PATH_DASHBOARD.employee.edit(currentEmployee.employee_id) : route("management.employee.new"),
				{
					...values,
					birth_date: format(new Date(values.birth_date), 'yyyy-MM-dd HH:mm:ss')
				},
				{
					preserveScroll: true,
					preserveState: true
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const handleDrop = useCallback(
		(acceptedFiles) => {
			const file = acceptedFiles[0];

			const newFile = Object.assign(file, {
				preview: URL.createObjectURL(file),
			});

			if (file) {
				setValue('img_src', newFile);
			}
		},
		[setValue]
	);

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<Grid container spacing={3}>
				<Grid item xs={12} md={4}>
					<Card sx={{ pt: 10, pb: 5, px: 3 }}>
						{isEdit && (
							<Label
								color={values.is_active === 1 ? 'warning' : 'success'}
								sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
							>
								{values.is_active === 1 ? "Inactive" : "Active"}
							</Label>
						)}

						<Box sx={{ mb: 5 }}>
							<RHFUploadAvatar
								name="img_src"
								maxSize={3145728}
								onDrop={handleDrop}
								accept={{
									'image/jpeg': [],
									'image/jpg': [],
									'image/png': []
								}}
								helperText={
									<Typography
										variant="caption"
										sx={{
											mt: 2,
											mx: 'auto',
											display: 'block',
											textAlign: 'center',
											color: 'text.secondary',
										}}
									>
										Allowed *.jpeg, *.jpg, *.png
										<br /> max size of {fData(3145728)}
									</Typography>
								}
							/>
						</Box>

						{isEdit && (
							<FormControlLabel
								labelPlacement="start"
								control={
									<Controller
										name="is_active"
										control={control}
										render={({ field }) => {
											return (
												<Switch
													{...field}
													checked={field.value === 0}
													onChange={(event) => field.onChange(event.target.checked ? 0 : 1)}
												/>
											)
										}}
									/>
								}
								label={
									<>
										<Typography variant="subtitle2" sx={{ mb: 0.5 }}>
											Active
										</Typography>
										<Typography variant="body2" sx={{ color: 'text.secondary' }}>
											Apply activation
										</Typography>
									</>
								}
								sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
							/>
						)}
					</Card>
				</Grid>

				<Grid item xs={12} md={8}>
					<Card sx={{ p: 3 }}>

						<Typography variant="h6" sx={{ color: 'text.disabled' }} >
							Personal Details
						</Typography>

						<Box
							rowGap={3}
							columnGap={2}
							display="grid"
							gridTemplateColumns={{
								xs: 'repeat(1, 1fr)',
								sm: 'repeat(2, 1fr)',
							}}
							sx={{ mt: 1, mb: 2 }}
						>
							{isEdit ? (
								<RHFTextField name="firstname" label="First Name" />
							) : (
								<Autocomplete
									inputValue={values.firstname}
									freeSolo
									options={users.map((user) => (`${user.firstname} ${user.lastname}`))}
									onInputChange={handleFirstnameChange}
									onChange={handleAutocompleteName}
									fullWidth
									renderInput={(params) => <TextField label="First Name" {...params} />}
								/>
							)}

							<RHFTextField name="middlename" label="Middle Name" />
							<RHFTextField name="lastname" label="Last Name" />
							<RHFTextField name="email" label="Email Address" />

							<Controller
								name="birth_date"
								control={control}
								render={({ field, fieldState: { error } }) => (
									<DatePicker
										label="Birth of Date"
										value={field.value}
										onChange={(newValue) => {
											field.onChange(newValue);
										}}
										renderInput={(params) => (
											<TextField {...params} fullWidth error={!!error} helperText={error?.message} />
										)}
									/>
								)}
							/>

							<RHFPhone name="phone_no" label="Phone Number" />

							<Stack>
								<Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
									Gender
								</Typography>
								<RHFRadioGroup
									name="sex"
									options={[
										{ label: "Male", value: "Male" },
										{ label: "Female", value: "Female" },
										{ label: "Others", value: "Others" },
									]}
									sx={{
										'& .MuiFormControlLabel-root': { mr: 4 },
									}}
								/>
							</Stack>
							<RHFSelect name="country" label="Country" placeholder="Country">
								<option value="" />
								{countries.map((option) => (
									<option key={option.code} value={option.label}>
										{option.label}
									</option>
								))}
							</RHFSelect>

						</Box>

						<Box sx={{ mb: 3 }}>
							<RHFTextField name="about" multiline rows={4} label="About" />
						</Box>

						<Typography variant="h6" sx={{ color: 'text.disabled' }} >
							Work Details
						</Typography>

						<Box
							rowGap={3}
							columnGap={2}
							display="grid"
							gridTemplateColumns={{
								xs: 'repeat(1, 1fr)',
								sm: 'repeat(2, 1fr)',
							}}
							sx={{ my: 1 }}
						>
							<RHFSelect name="company" label="Company" placeholder="Company">
								<option value=""></option>
								{companies.map((option) => (
									<option key={option.company_id} value={option.company_id}>
										{option.company_name}
									</option>
								))}
							</RHFSelect>

							<RHFSelect name="company_type" label="Company Type" placeholder="Company Type">
								<option value=""></option>
								<option value="main contractor">Main Contractor</option>
								<option value="sub contractor">Sub Contractor</option>
								<option value="client">Client</option>
							</RHFSelect>

							<RHFSelect name="position" label="Role" placeholder="Role">
								<option value=""></option>
								{positions.map((option) => (
									<option key={option.position_id} value={option.position_id}>
										{option.position}
									</option>
								))}
							</RHFSelect>

							<RHFSelect name="department" label="Department" placeholder="Department">
								<option value=""></option>
								{departments.map((option) => (
									<option key={option.department_id} value={option.department_id}>
										{option.department}
									</option>
								))}
							</RHFSelect>

						</Box>

						<Stack alignItems="flex-end" sx={{ mt: 3 }}>
							<LoadingButton type="submit" variant="contained" loading={isSubmitting}>
								{!currentEmployee ? 'Create Employee' : 'Save Changes'}
							</LoadingButton>
						</Stack>
					</Card>
				</Grid>
			</Grid>
		</FormProvider>
	);
}
