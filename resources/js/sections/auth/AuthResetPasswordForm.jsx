import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH } from '@/routes/paths';
// components
import FormProvider, { RHFTextField } from '@/Components/hook-form';

// ----------------------------------------------------------------------

export default function AuthResetPasswordForm () {
	// const navigate = useNavigate();

	const ResetPasswordSchema = Yup.object().shape({
		email: Yup.string().email('Email must be a valid email address').required('Email is required'),
	});

	const methods = useForm({
		resolver: yupResolver(ResetPasswordSchema),
		defaultValues: { email: '' },
	});

	const {
		handleSubmit,
		formState: { isSubmitting },
	} = methods;

	const onSubmit = async (data) => {
		try {
			await new Promise((resolve) => setTimeout(resolve, 500));

			sessionStorage.setItem('email-recovery', data.email);

			// navigate(PATH_AUTH.newPassword);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<RHFTextField name="email" label="Email address" />

			<LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} sx={{ mt: 3 }}>
				Send Request
			</LoadingButton>
		</FormProvider>
	);
}
