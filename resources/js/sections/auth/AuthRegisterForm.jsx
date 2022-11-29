import { useEffect, useState } from 'react';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '@/Components/iconify';
import FormProvider, { RHFTextField } from '@/Components/hook-form';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

export default function AuthRegisterForm () {
	const { errors: resErrors } = usePage().props;
	console.log(resErrors);
	const [showPassword, setShowPassword] = useState(false);

	const RegisterSchema = Yup.object().shape({
		firstname: Yup.string().required('First name must not be empty.'),
		lastname: Yup.string().required('Last name must not be empty.'),
		username: Yup.string().required('Username must not be empty.'),
		email: Yup.string().email('Email must be a valid email address').required('Email must not be empty'),
		password: Yup.string().required('Password must not be empty'),
		password_confirmation: Yup.string()
			.oneOf([Yup.ref('password'), null], 'Password and confirm password must match'),
	});

	const defaultValues = {
		firstname: '',
		lastname: '',
		username: '',
		email: '',
		password: '',
		password_confirmation: ''
	};

	const methods = useForm({
		resolver: yupResolver(RegisterSchema),
		defaultValues,
	});

	const {
		reset,
		setError,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = methods;


	useEffect(() => {
		if (Object.keys(resErrors).length !== 0) {
			for (const key in resErrors) {
				setError(key, { type: "custom", message: resErrors[key] });
			}
		}
	}, [resErrors]);


	const onSubmit = async (data) => {
		try {
			Inertia.post(route('register'), data, {
				preserveScroll: true,
				preserveState: true
			});
		} catch (error) {
			console.error(error);
			reset();
			setError('afterSubmit', {
				...error,
				message: error.message,
			});
		}
	};

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<Stack spacing={2.5}>
				{!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

				<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
					<RHFTextField name="firstname" label="First name" />
					<RHFTextField name="lastname" label="Last name" />
				</Stack>

				<RHFTextField name="email" label="Email address" />
				<RHFTextField name="username" label="Username" />

				<RHFTextField
					name="password"
					label="Password"
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

				<RHFTextField
					name="password_confirmation"
					label="Confirm Password"
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

				<LoadingButton
					fullWidth
					color="inherit"
					size="large"
					type="submit"
					variant="contained"
					loading={isSubmitting}
					sx={{
						bgcolor: 'text.primary',
						color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
						'&:hover': {
							bgcolor: 'text.primary',
							color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
						},
					}}
				>
					Create account
				</LoadingButton>
			</Stack>
		</FormProvider>
	);
}
