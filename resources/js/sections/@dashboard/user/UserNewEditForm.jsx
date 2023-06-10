import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, TextField, Autocomplete, InputAdornment, IconButton } from '@mui/material';
// utils
import { fData } from '@/utils/formatNumber';
// components
import Label from '@/Components/label';
import FormProvider, { RHFRadioGroup, RHFTextField, RHFUploadAvatar } from '@/Components/hook-form';
import Iconify from '@/Components/iconify';
import { usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';

// ----------------------------------------------------------------------

const NewUserSchema = Yup.object().shape({
	firstname: Yup.string().required('Please select an employee'),
	emp_id: Yup.number().required('Please select an employee'),
	lastname: Yup.string().required('Please select an employee'),
	email: Yup.string().email("Must be a valid email address").required('Please select an employee'),
	username: Yup.string().required('Username must not be empty'),
	password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is must not be empty'),
	password_confirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
	about: Yup.string().max(255, "About must not exceed 255 characters"),
	user_type: Yup.number().required()
});

const UpdateUserSchema = Yup.object().shape({
	firstname: Yup.string().required('Please select an employee'),
	lastname: Yup.string().required('Please select an employee'),
	email: Yup.string().email("Must be a valid email address").required('Please select an employee'),
	username: Yup.string().required('Username must not be empty'),
	password: Yup.string().matches(/^(|.{6,})$/, 'Password must be at least 6 characters'),
	password_confirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
	user_type: Yup.number().required()
});


UserNewEditForm.propTypes = {
	isEdit: PropTypes.bool,
	user: PropTypes.object,
};

export default function UserNewEditForm ({ isEdit = false, user, employees }) {
	const { errors: resErrors } = usePage().props;
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const defaultValues = useMemo(
		() => ({
			email: user?.email || '',
			emp_id: user?.emp_id || '',
			firstname: user?.firstname || user?.employee?.firstname || '',
			lastname: user?.lastname || user?.employee?.lastname || '',
			password: '',
			password_confirmation: '',
			profile_pic: user?.profile_pic ? `/storage/media/photos/employee/${user?.profile_pic}` : null,
			username: user?.username || '',
			user_type: user?.user_type === 0 ? 0 : 1,
			status: user?.status === 0 ? 0 : 1
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[user]
	);

	const methods = useForm({
		resolver: yupResolver(isEdit ? UpdateUserSchema : NewUserSchema),
		defaultValues,
	});

	const {
		reset,
		watch,
		control,
		setValue,
		handleSubmit,
		setError,
		formState: { isDirty, errors },
	} = methods;

	const values = watch()

	useEffect(() => {
		if (isEdit && user) {
			reset(defaultValues);
		}
		if (!isEdit) {
			reset(defaultValues);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isEdit, user]);


	useEffect(() => {
		if (Object.keys(resErrors).length !== 0) {
			for (const key in resErrors) {
				setError(key, { type: "custom", message: resErrors[key] });
			}
		}
	}, [resErrors]);

	const handleAutocompleteName = (_, val) => {
		if (val) {
			const random4digits = Math.floor(500 + Math.random() * 9000);
			const emp = employees.find(emp => emp.employee_id === val?.employee_id);
			setValue("firstname", emp?.firstname, { shouldDirty: true, shouldValidate: true });
			setValue("lastname", emp?.lastname, { shouldDirty: true, shouldValidate: true });
			setValue("email", emp?.email, { shouldDirty: true, shouldValidate: true });
			setValue("about", emp?.about || "", { shouldDirty: true, shouldValidate: true });
			setValue("emp_id", val?.employee_id, { shouldDirty: true, shouldValidate: true });
			setValue("username", emp.firstname.toLowerCase() + random4digits, { shouldDirty: true, shouldValidate: true });
		} else {
			reset({ firstname: "", lastname: "", about: "", email: "" });
		}
	}

	// const generateRandomPassword = () => {
	// 	const randomstring = Math.random().toString(36).slice(-8);
	// 	setValue("password", randomstring, { shouldDirty: true, shouldValidate: true });
	// 	setValue("password_confirmation", randomstring, { shouldDirty: true, shouldValidate: true });
	// }

	const handleDrop = useCallback(
		(acceptedFiles) => {
			const file = acceptedFiles[0];

			const newFile = Object.assign(file, {
				preview: URL.createObjectURL(file),
			});

			if (file) {
				setValue('profile_pic', newFile, { shouldDirty: true });
			}
		},
		[setValue]
	);


	const onSubmit = async (data) => {
		try {
			Inertia.post(isEdit ? route("management.user.update", user.user_id) : route('management.user.store'), data, {
				onStart () {
					setLoading(true);
				},
				onFinish () {
					setLoading(false);
				},
				preserveScroll: true,
				preserveState: true
			});
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<Grid container spacing={3}>
				<Grid item xs={12} md={4}>
					<Card sx={{ pt: 10, pb: 5, px: 3 }}>
						{isEdit && (
							<Label
								color={values.user_type === 1 ? 'warning' : 'success'}
								sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
							>
								{values.user_type === 1 ? "User" : "Admin"}
							</Label>
						)}

						<Box sx={{ mb: 5 }}>
							<RHFUploadAvatar
								name="profile_pic"
								maxSize={3145728}
								onDrop={handleDrop}
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
										Allowed *.jpeg, *.jpg, *.png, *.gif
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
										name="status"
										control={control}
										render={({ field }) => (
											<Switch
												{...field}
												checked={field.value == 1}
												onChange={(event) => field.onChange(event.target.checked ? 1 : 0)}
											/>
										)}
									/>
								}
								label={
									<>
										<Typography variant="subtitle2" sx={{ mb: 0.5 }}>
											Activate
										</Typography>
										<Typography variant="body2" sx={{ color: 'text.secondary' }}>
											Apply activation on account
										</Typography>
									</>
								}
								sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
							/>
						)}

						{/* <RHFSwitch
							name="isVerified"
							labelPlacement="start"
							label={
								<>
									<Typography variant="subtitle2" sx={{ mb: 0.5 }}>
										Email Verified
									</Typography>
									<Typography variant="body2" sx={{ color: 'text.secondary' }}>
										Disabling this will automatically send the user a verification email
									</Typography>
								</>
							}
							sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
						/> */}
					</Card>
				</Grid>

				<Grid item xs={12} md={8}>
					<Card sx={{ p: 3 }}>

						<Box
							rowGap={3}
							columnGap={2}
							display="grid"
							gridTemplateColumns={{
								xs: 'repeat(1, 1fr)',
								sm: 'repeat(2, 1fr)',
							}}
						>
							{isEdit ? (
								<TextField
									label="Employee"
									defaultValue={user?.employee?.firstname + " " + user?.employee?.lastname}
									InputProps={{
										readOnly: true
									}}
								/>
							) : (
								<Autocomplete
									clearOnEscape
									noOptionsText="Employee not found"
									options={employees}
									onChange={handleAutocompleteName}
									fullWidth
									getOptionLabel={(option) => (`${option?.firstname} ${option?.lastname}`)}
									renderOption={(props, option) => {
										return (
											<li {...props} key={option.employee_id}>
												{`${option?.firstname} ${option?.lastname}`}
											</li>
										);
									}}
									renderInput={(params) =>
										<TextField
											label="Select Employee"
											{...params}
											error={!!errors?.employee_id?.message}
											helperText={errors?.employee_id?.message}
										/>
									}
								/>
							)}

							<RHFTextField
								name="username"
								label="Username"
							/>

							<Stack>
								<Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
									Account Type
								</Typography>
								<RHFRadioGroup
									name="user_type"
									options={[
										{ label: "User", value: 1 },
										{ label: "Admin", value: 0 },
									]}
									sx={{
										'& .MuiFormControlLabel-root': { mr: 4 },
									}}
								/>
							</Stack>

							<RHFTextField name="email" label="Email Address" />

							<RHFTextField
								name="firstname"
								label="First name"
							/>

							<RHFTextField
								name="lastname"
								label="Last name"
							/>

							{isEdit ? (
								<RHFTextField
									name="password"
									label={isEdit ? "Update Password" : "Password"}
									type={showPassword ? 'text' : 'password'}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
													<Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
												</IconButton>
											</InputAdornment>
										),
									}}
									helperText={
										<Stack component="span" direction="row" alignItems="center">
											{errors?.password?.message ? (
												errors?.password?.message
											) : (
												<>
													<Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> Leave blank if you don't want to change the password.
												</>
											)}
										</Stack>
									}
								/>
							) : (
								<RHFTextField
									name="password"
									label={isEdit ? "Update Password" : "Password"}
									type={showPassword ? 'text' : 'password'}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
													<Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
												</IconButton>
											</InputAdornment>
										),
									}}
								/>
							)}
							<RHFTextField
								label="Confirm Password"
								name="password_confirmation"
								type={showPassword ? 'text' : 'password'}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
												<Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
											</IconButton>
										</InputAdornment>
									),
								}}
							/>
						</Box>

						<Stack alignItems="flex-end" sx={{ mt: 3 }}>
							<LoadingButton type="submit" variant="contained" disabled={!isDirty} loading={loading}>
								{!isEdit ? 'Create User' : 'Save Changes'}
							</LoadingButton>
						</Stack>
					</Card>
				</Grid>
			</Grid>
		</FormProvider>
	);
}
