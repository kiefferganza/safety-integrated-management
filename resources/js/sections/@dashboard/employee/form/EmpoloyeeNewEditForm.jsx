import { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, TextField } from '@mui/material';
// utils
import { fData } from '@/utils/formatNumber';
// components
import Label from '@/Components/label';
import FormProvider, { RHFPhone, RHFRadioGroup, RHFSelect, RHFTextField, RHFUploadAvatar } from '@/Components/hook-form';
import { getCurrentUserImage } from '@/utils/formatName';
import { usePage } from '@inertiajs/inertia-react';
import { DatePicker } from '@mui/x-date-pickers';
import { Inertia } from '@inertiajs/inertia';
import { format } from 'date-fns';
import { PATH_DASHBOARD } from '@/routes/paths';
import _ from 'lodash';

// ----------------------------------------------------------------------

EmpoloyeeNewEditForm.propTypes = {
	currentEmployee: PropTypes.object,
	departments: PropTypes.array,
	nationalities: PropTypes.array,
	positions: PropTypes.array
};

export default function EmpoloyeeNewEditForm ({ companies, departments, nationalities, positions, currentEmployee, isEdit = false }) {
	// const { companies, departments, nationalities, positions, currentEmployee } = usePage().props;

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
		nationality: Yup.string().required('Nationality is required'),
		birth_date: Yup.string().required('Date of birth is required')
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
		nationality: currentEmployee?.nationality || '',
		img_src: currentEmployee?.img_src ? getCurrentUserImage(currentEmployee) : '',
		birth_date: currentEmployee?.birth_date || '',
		sex: currentEmployee?.sex || 'Male',
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
		formState: { isSubmitting },
	} = methods;

	const values = watch();

	const onSubmit = async () => {
		try {
			Inertia.post(
				isEdit ? PATH_DASHBOARD.employee.edit(currentEmployee.employee_id) : route("management.employee.new"),
				{
					...values,
					birth_date: format(new Date(values.birth_date), 'yyyy-MM-dd HH:mm:ss')
				},
				{
					preserveScroll: true
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
							<RHFTextField name="firstname" label="First Name" />
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

							<RHFSelect name="nationality" label="Country" placeholder="Country">
								<option value=""></option>
								{nationalities.map((option) => (
									<option key={option.id} value={option.id} style={{ textTransform: "capitalize" }}>
										{_.capitalize(option.name)}
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
