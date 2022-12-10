import { useEffect, useState } from 'react';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '@/Components/iconify';
import FormProvider, { RHFTextField } from '@/Components/hook-form';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';

// ----------------------------------------------------------------------

export default function AccountChangePassword () {
	const { errors: resErrors } = usePage().props;
	const [loading, setLoading] = useState(false);

	const ChangePassWordSchema = Yup.object().shape({
		oldPassword: Yup.string().required('Old Password is required'),
		newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New Password is required'),
		newPassword_confirmation: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
	});

	const defaultValues = {
		oldPassword: '',
		newPassword: '',
		newPassword_confirmation: '',
	};

	const methods = useForm({
		resolver: yupResolver(ChangePassWordSchema),
		defaultValues,
	});

	const {
		handleSubmit,
		setError,
		reset
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
			Inertia.post(route("management.user.change_pass"), data, {
				preserveScroll: true,
				preserveState: true,
				onStart () {
					setLoading(true);
				},
				onFinish () {
					setLoading(false);
				}
			});
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<Card>
				<Stack spacing={3} alignItems="flex-end" sx={{ p: 3 }}>
					<RHFTextField name="oldPassword" type="password" label="Old Password" />

					<RHFTextField
						name="newPassword"
						type="password"
						label="New Password"
						helperText={
							<Stack component="span" direction="row" alignItems="center">
								<Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> Password must be minimum 6+
							</Stack>
						}
					/>

					<RHFTextField name="newPassword_confirmation" type="password" label="Confirm New Password" />

					<LoadingButton type="submit" variant="contained" loading={loading}>
						Save Changes
					</LoadingButton>
				</Stack>
			</Card>
		</FormProvider>
	);
}
